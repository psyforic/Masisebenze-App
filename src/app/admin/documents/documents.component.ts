import { Component, ViewChild, Injector, ElementRef, OnInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatOptionSelectionChange } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import {
  DocumentListDto,
  DocumentServiceProxy,
  ClientServiceProxy,
  ClientListDto,
  ContactDetailOutput,
  ContactServiceProxy,
  DocumentDetailOutput
} from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import {
  AngularFireStorageReference,
  AngularFireUploadTask,
  AngularFireStorage
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { AppComponentBase } from '@shared/app-component-base';
import { NewDocumentComponent } from './new-document/new-document.component';
import { DocumentFolder } from './document-types';

declare const $: any;
interface IDocType {
  id: number;
  value: string;
}
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  providers: [DocumentServiceProxy, ClientServiceProxy, ContactServiceProxy]
})
export class DocumentsComponent extends AppComponentBase implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('fileAuthor', { static: false }) authorName: ElementRef;
  @ViewChild('fileDate', { static: false }) authorDate: ElementRef;
  @ViewChild('newDocument', { static: false }) createDocument: NewDocumentComponent;
  uploadUrl: string;
  uploadedFiles: DocumentListDto[] = [];
  showInput = true;
  displayedColumns = ['select', 'type', 'author', 'authorDate', 'upload'];
  selection = new SelectionModel<IDocType>(true, []);
  dataSource: MatTableDataSource<IDocType> = new MatTableDataSource<IDocType>();
  documentTypes = DocumentFolder.documentTypes;
  clientDocuments: DocumentDetailOutput[] = [];
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;
  author: string;
  date: any;
  client: ClientListDto = new ClientListDto();
  contact: ContactDetailOutput = new ContactDetailOutput();
  clientId: string;
  contactId: string;
  input: DocumentDetailOutput = new DocumentDetailOutput();
  isUploading = false;
  uploadForm: FormGroup;
  isLoading = false;

  constructor(injector: Injector,
    private route: ActivatedRoute,
    private documentService: DocumentServiceProxy,
    private clientService: ClientServiceProxy,
    private contactService: ContactServiceProxy,
    private afStorage: AngularFireStorage,
    private fb: FormBuilder) {
    super(injector);
    this.route.queryParamMap.subscribe(params => {
      this.clientId = params.get('clientId');
      this.contactId = params.get('contactId');
    });
  }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.documentTypes);
    this.getClientDocuments();
    this.getUsers();
  }

  onBeforeSend(event): void {
    event.xhr.setRequestHeader('Authorization', 'Bearer ');
  }

  getUsers() {
    this.clientService.getById(this.clientId)
      .subscribe((result) => {
        this.client = result;
      });
    this.contactService.getById(this.contactId)
      .subscribe((result) => {
        this.contact = result;
      });
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select());
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: IDocType): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  upload(event, index, docId) {
    this.isUploading = true;
    const id = Math.random().toString(36).substring(2);
    const metaData = {
      contentType: 'application/pdf'
    };
    this.ref = this.afStorage.ref(id + 'pdf');
    this.task = this.ref.put(event.target.files[0], metaData);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges()
      .pipe(finalize(() => {
        this.downloadURL = this.ref.getDownloadURL();
        this.downloadURL.subscribe((res) => {
          this.uploadFile(index, docId, res);
        });

      })).subscribe(() => {

      });
  }
  addNewFile() {
    this.createDocument.open();
  }

  uploadFile(index, id, uploadUrl) {
    const authorName = $('#author' + index).val();
    const fileName = $('#filename' + index).val();
    this.input = new DocumentDetailOutput();
    this.input.id = id;
    this.input.contactId = this.contactId;
    this.input.clientId = this.clientId;
    this.input.parentDocId = id;
    this.input.authorName = authorName;
    this.input.authorDate = this.date;
    this.input.fileUrl = uploadUrl;
    this.input.identifier = 1;
    this.input.name = fileName;
    this.documentService.createDocument(this.input).pipe((finalize(() => {
    }))).subscribe(() => {
      this.isUploading = false;
      abp.notify.success('File Uploaded Successfully');
      this.getClientDocuments();
    });
  }
  isValidDate(d) {
    const s = Date.parse(d);
    return isNaN(s);
  }
  isInValid(index, fileName) {
    const authorName = $('#author' + index).val();
    const authorDate = $('#date' + index).val();
    return ((authorName === 'undefined' || authorName === '')
      || (authorDate === 'undefined' || authorDate === '')) && fileName !== 'Copy of Id or smartcard'
      ? true : false;
  }
  selectDate(event) {
    this.date = event.value;
    let hoursDiff: number;
    let minutesDiff: number;
    if (this.date !== null && this.date !== 'undefined' && !this.isValidDate(this.date)) {
      this.date = new Date(this.date);
      hoursDiff = this.date.getHours() - this.date.getTimezoneOffset() / 60;
      minutesDiff = (this.date.getHours() - this.date.getTimezoneOffset()) % 60;
      this.date.setHours(hoursDiff);
      this.date.setMinutes(minutesDiff);
    }
    this.input.authorDate = this.date;
  }
  getClientDocuments() {
    this.documentService.getAllUserDocuments(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.uploadedFiles = result.items;
        this.documentTypes.forEach((documentType) => {
          if (this.uploadedFiles.filter(f => f.parentDocId === documentType.id).length > 0) {
            const file = this.uploadedFiles.filter(f => f.parentDocId === documentType.id)[0];
            this.clientDocuments.push(file);
          } else {
            const file = new DocumentDetailOutput();
            this.clientDocuments.push(file);
          }
        });
        this.dataSource = new MatTableDataSource(this.documentTypes);
        this.dataSource.paginator = this.paginator;
      });
  }
}

