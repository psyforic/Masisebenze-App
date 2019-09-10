import { Component, ViewChild, Injector } from '@angular/core';
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

export interface File {
  id: number;
  name: string;
}

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  providers: [DocumentServiceProxy, ClientServiceProxy, ContactServiceProxy]
})
export class DocumentsComponent extends PagedListingComponentBase<DocumentListDto> {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  uploadUrl: string;
  uploadedFiles: DocumentListDto[] = [];

  displayedColumns = ['select', 'name', 'author', 'authorDate', 'status', 'upload', 'actions'];
  selection = new SelectionModel<DocumentListDto>(true, []);
  dataSource: MatTableDataSource<DocumentListDto> = new MatTableDataSource<DocumentListDto>();

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;

  client: ClientListDto = new ClientListDto();
  contact: ContactDetailOutput = new ContactDetailOutput();
  clientId: string;
  contactId: string;
  input: DocumentDetailOutput = new DocumentDetailOutput();

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
  upload(event, authorName: any, authorDate: any) {
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges()
      .pipe(finalize(() => {
        this.downloadURL = this.ref.getDownloadURL();
        this.downloadURL.subscribe((res) => {
          this.input.fileUrl = res;
        });
        console.log('Author', authorName.value);
        console.log(this.input.fileUrl);
        // this.input.authorDate = authorDate;
        // this.input.authorName = authorName;
        // this.documentService.editDocument(this.input).subscribe(() => {
        //   abp.notify.success('File Uploaded Successfully');
        // });
      })).subscribe();
  }
  onClicked(row) {
    console.log(row);
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
