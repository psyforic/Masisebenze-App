import { Component, OnInit, Injector, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CreateDocumentInput, DocumentServiceProxy } from '@shared/service-proxies/service-proxies';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-document',
  templateUrl: './new-document.component.html',
  styleUrls: ['./new-document.component.scss']
})
export class NewDocumentComponent extends AppComponentBase implements OnInit {

  @Input() clientId;
  @Input() contactId;
  @ViewChild('content', { static: false }) content: ElementRef;
  @Output() documentAdded = new EventEmitter();
  document: CreateDocumentInput = new CreateDocumentInput();
  documentForm: FormGroup;
  parentDocId: string;
  isUploading = false;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;
  file: any;
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
      name: ['', Validators.required],
      authorName: ['', Validators.required],
      authorDate: ['', Validators.required],
      fileInput: ['', Validators.required]
    });
  }
  open() {
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false, size: 'lg' })
      .result.then((result) => {
      }, (reason) => {
      });
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
