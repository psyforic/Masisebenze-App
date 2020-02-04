import { Event } from './../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, Injector, ViewChild, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import {
  ClientServiceProxy,
  DocumentServiceProxy,
  ClientDetailOutput,
  CreateDocumentInput,
  DocumentListDto
} from '@shared/service-proxies/service-proxies';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize, map } from 'rxjs/operators';
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { MatOptionSelectionChange } from '@angular/material';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss'],
  providers: [ClientServiceProxy, DocumentServiceProxy]
})
export class UploadDocumentComponent extends AppComponentBase implements OnInit {
  @ViewChild('fileName', { static: false }) docName: ElementRef;
  clientId: string;
  client: ClientDetailOutput = new ClientDetailOutput();
  document: CreateDocumentInput = new CreateDocumentInput();
  documents: DocumentListDto[] = [];
  documentForm: FormGroup;
  parentDocId: string;
  contactId: string;
  isUploading = false;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;
  file: any;
  fileName = '';
  constructor(private injector: Injector,
    private route: ActivatedRoute,
    private clientService: ClientServiceProxy,
    private documentService: DocumentServiceProxy,
    private afStorage: AngularFireStorage,
    private fb: FormBuilder) {
    super(injector);
    this.route.paramMap.subscribe((paramMap) => {
      this.clientId = paramMap.get('id');
    });
  }
  ngOnInit() {
    this.initializeForm();
    this.getClient();
    this.getDocuments();
  }
  initializeForm() {
    this.documentForm = this.fb.group({
      parentDocId: ['', Validators.required],
      name: ['', Validators.required],
      authorName: ['', Validators.required],
      authorDate: [''],
      fileInput: ['', Validators.required]
    });
  }
  getClient() {
    this.clientService.getDetail(this.clientId).subscribe((result) => {
      this.client = result;
      this.contactId = result.contactId;
    });
  }
  getDocuments() {
    this.documentService.getAllUserDocuments(this.clientId)
      .subscribe((result) => {
        this.documents = result.items.filter(x => x.parentDocId == null);
      });
  }
  selectedId(event: MatOptionSelectionChange, fileName: string) {
    if (event.source.selected) {
      this.fileName = fileName;
      this.parentDocId = event.source.value;
      this.documentForm.controls['fileInput'].setValue('');
    }
  }
  tester(event) {
    console.log(event);
  }
  upload(event) {
    this.file = event.target.files[0];
    this.documentForm.controls['fileInput'].setValue(this.file ? this.file.name : '');
  }
  isRequired(fileName: string): boolean {
    if (fileName === 'Hospital records' || fileName === 'Clinical notes' || fileName === 'Copy of passport') {
      return false;
    }
    return true;
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
            });
        });
      })).subscribe(() => {
      });
  }
}
