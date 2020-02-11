import { Component, OnInit, Injector, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CreateDocumentInput, DocumentServiceProxy } from '@shared/service-proxies/service-proxies';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentFolder } from '../document-types';
import { MatOptionSelectionChange } from '@angular/material';

@Component({
  selector: 'app-new-document',
  templateUrl: './new-document.component.html',
  styleUrls: ['./new-document.component.scss']
})
export class NewDocumentComponent extends AppComponentBase implements OnInit {

  @Input() clientId: string;
  @Input() contactId: string;
  @ViewChild('content', { static: false }) content: ElementRef;
  @Output() documentAdded = new EventEmitter();
  document: CreateDocumentInput = new CreateDocumentInput();
  documentForm: FormGroup;
  parentDocId: string;
  isUploading = false;
  documentTypes = DocumentFolder.documentTypes;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;
  file: any;
  fileName = '';
  constructor(private injector: Injector,
    private documentService: DocumentServiceProxy,
    private afStorage: AngularFireStorage,
    private modalService: NgbModal,
    private fb: FormBuilder) {
    super(injector);
  }
  ngOnInit() {
    this.initializeForm();
  }
  initializeForm() {
    this.documentForm = this.fb.group({
      parentDocId: ['', Validators.required],
      authorName: ['', Validators.required],
      authorDate: ['', Validators.required],
      fileInput: ['', Validators.required]
    });
  }
  selectedId(event: MatOptionSelectionChange, fileName) {
    if (event.source.selected) {
      this.parentDocId = event.source.value;
      this.fileName = fileName;
      this.documentForm.controls['fileInput'].setValue('');
    }
  }
  open() {
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false, size: 'lg' })
      .result.then((result) => {
      }, (reason) => {
      });
  }
  isRequired(fileName: string): boolean {
    if (fileName === 'Hospital records' || fileName === 'Clinical notes' || fileName === 'Copy of passport') {
      return false;
    }
    return true;
  }
  upload(event) {
    this.file = event.target.files[0];
    this.documentForm.controls['fileInput'].setValue(this.file ? this.file.name : '');
  }
  save() {
    this.isUploading = true;
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id + '.pdf');
    const metadata = {
      contentType: this.file.type,
    };
    this.task = this.ref.put(this.file, metadata);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges()
      .pipe(finalize(() => {
        this.downloadURL = this.ref.getDownloadURL();
        this.downloadURL.subscribe((res) => {
          this.document = Object.assign({}, this.documentForm.value);
          this.document.fileUrl = res;
          this.document.contactId = this.contactId;
          this.document.clientId = this.clientId;
          this.document.identifier = 1;
          this.document.name = this.fileName;
          this.documentService.createDocument(this.document)
            .pipe(finalize(() => {
            }))
            .subscribe(() => {
              this.notify.success('Document Added Successfully');
              this.isUploading = false;
              this.documentForm.reset();
              this.documentForm.markAsUntouched();
              this.modalService.dismissAll();
            });
        });
      })).subscribe(() => {
      });
  }
}
