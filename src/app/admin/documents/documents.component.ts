import { Component, ViewChild, Injector, ElementRef } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
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
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';

declare const $: any;
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  providers: [DocumentServiceProxy, ClientServiceProxy, ContactServiceProxy]
})
export class DocumentsComponent extends PagedListingComponentBase<DocumentListDto> {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('fileAuthor', { static: false }) authorName: ElementRef;
  @ViewChild('fileDate', { static: false }) authorDate: ElementRef;
  uploadUrl: string;
  uploadedFiles: DocumentListDto[] = [];
  showInput = true;
  displayedColumns = ['select', 'name', 'author', 'authorDate', 'upload', 'actions'];
  selection = new SelectionModel<DocumentListDto>(true, []);
  dataSource: MatTableDataSource<DocumentListDto> = new MatTableDataSource<DocumentListDto>();

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;
  author: string;
  date: string;
  client: ClientListDto = new ClientListDto();
  contact: ContactDetailOutput = new ContactDetailOutput();
  clientId: string;
  contactId: string;
  input: DocumentDetailOutput;

  uploadForm: FormGroup;
  totalfiles: Array<File> = [];
  totalFileName = [];
  lengthCheckToaddMore = 0;

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
  onUpload(event): void {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
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
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: DocumentListDto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  upload(event, index, docId) {
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges()
      .pipe(finalize(() => {
        this.downloadURL = this.ref.getDownloadURL();
        this.downloadURL.subscribe((res) => {
          this.uploadUrl = res;
        });
        this.uploadFile(index, docId, this.uploadUrl);
      })).subscribe();
  }

  onClicked(fileName, fileAuthor) {
    // console.log(this.authorName.nativeElement.value);
    // console.log(this.authorDate.nativeElement.value);
    console.log(fileName);
    console.log(fileAuthor);
  }

  uploadFile(index, id, uploadUrl) {
    const authorName = $('#author' + index).val();
    const authorDate = $('#date' + index).val();
    const momentDate = new Date(authorDate);
    const formattedDate = moment(momentDate).format('YYYY-MM-DD');

    this.input = new DocumentDetailOutput();
    this.input.id = id;
    this.input.authorName = authorName;
    this.input.authorDate = moment(formattedDate);
    this.input.fileUrl = uploadUrl;
    this.input.identifier = 1;

    this.documentService.editDocument(this.input).subscribe(() => {
      abp.notify.success('File Uploaded Successfully');
    });
  }
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.documentService.getAll(request.sorting, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => {
        finishedCallback();
      })).subscribe((result) => {
        console.log(result);
        this.uploadedFiles = result.items.filter((client) => {
          return client.clientId === this.clientId;
        });
        console.log('Files', result.items);
        this.dataSource = new MatTableDataSource(this.uploadedFiles);
        this.dataSource.paginator = this.paginator;
        // this.showPaging(result, pageNumber);

      });
    this.getUsers();
  }
  protected delete(entity: DocumentListDto): void {
    // TODO: Implement Method
  }

}
