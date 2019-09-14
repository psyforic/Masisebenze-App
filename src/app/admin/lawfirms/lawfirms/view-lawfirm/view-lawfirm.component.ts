import { Component, OnInit, ViewChild, AfterViewInit, Injector } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NewContactComponent } from '../new-contact/new-contact.component';
import { NewClientComponent } from '../new-client/new-client.component';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import {
  LawFirmServiceProxy,
  LawFirmDetailOutput,
  ContactListDto,
  ContactServiceProxy,
  ClientServiceProxy,
  ClientListDto,
  AttorneyListDto
} from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { NewAttorneyComponent } from '../../attorneys/new-attorney/new-attorney.component';
import { ViewAttorneyComponent } from '../../attorneys/view-attorney/view-attorney.component';
import { EditAttorneyComponent } from '../../attorneys/edit-attorney/edit-attorney.component';
import { EditContactComponent } from '../../contacts/edit-contact/edit-contact.component';


@Component({
  selector: 'app-view-lawfirm',
  templateUrl: './view-lawfirm.component.html',
  styleUrls: ['./view-lawfirm.component.scss'],
  providers: [LawFirmServiceProxy, ContactServiceProxy, ClientServiceProxy]
})
export class ViewLawfirmComponent extends PagedListingComponentBase<ContactListDto> implements AfterViewInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @ViewChild(MatPaginator, { static: false }) clientPaginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) clientSort: MatSort;


  @ViewChild(MatPaginator, { static: false }) attorneyPaginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) attorneySort: MatSort;

  @ViewChild('newContact', { static: false }) newContactRef: NewContactComponent;
  @ViewChild('editContact', { static: false }) editContactRef: EditContactComponent;

  @ViewChild('newClient', { static: false }) newClientRef: NewClientComponent;
  @ViewChild('newAttorney', { static: false }) newAttorneyRef: NewAttorneyComponent;
  @ViewChild('viewAttorney', { static: false }) viewAttorneyRef: ViewAttorneyComponent;
  @ViewChild('editAttorney', { static: false }) editAttorneyRef: EditAttorneyComponent;


  dataSource: MatTableDataSource<ContactListDto> = new MatTableDataSource<ContactListDto>();
  clientDataSource: MatTableDataSource<ClientListDto> = new MatTableDataSource<ClientListDto>();
  attorneyDataSource: MatTableDataSource<AttorneyListDto> = new MatTableDataSource<AttorneyListDto>();

  contacts: ContactListDto[] = [];
  clients: ClientListDto[] = [];
  attorneys: AttorneyListDto[] = [];

  displayedColumns = ['firstName', 'lastName', 'email', 'role', 'actions'];
  displayedAttCols = ['firstName', 'lastName', 'email', 'phone', 'actions'];
  clientDisplayedColumns = ['firstName', 'lastName', 'dob', 'age', 'dateOfInjury', 'actions'];

  lawFirmId: string;
  lawFirm: LawFirmDetailOutput = new LawFirmDetailOutput();
  isSaving = false;
  constructor(private injector: Injector,
    private route: ActivatedRoute,
    private lawFimService: LawFirmServiceProxy,
    private contactService: ContactServiceProxy,
    private clientService: ClientServiceProxy) {
    super(injector);
    this.route.paramMap.subscribe((paramMap) => {
      this.lawFirmId = paramMap.get('id');
    });
  }
  ngAfterViewInit(): void {
    // this.refresh();
  }


  getLawFirm() {
    this.lawFimService.getDetail(this.lawFirmId).subscribe((result) => {
      this.lawFirm = result;
    });
  }
  addContact() {
    this.newContactRef.open();
  }
  editSelectedContact(id: string) {
    this.editContactRef.open(id);
  }
  deleteContact(contact: any) {
    this.editContactRef.delete(contact);
  }
  addClient() {
    this.newClientRef.open(this.lawFirmId);
  }
  addAttorney() {
    this.newAttorneyRef.open();
  }
  displayContact(contact) {
    this.refresh();
    this.dataSource._updateChangeSubscription();
  }
  viewSelectedAttorney(id: string) {
    this.viewAttorneyRef.open(id);
  }
  editSelectedAttorney(id: string) {
    this.editAttorneyRef.open(id);
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.clientDataSource.filter = filterValue;
  }
  getAttorneys() {
    this.lawFimService.getAttorneys(this.lawFirmId)
      .subscribe((result) => {
        this.attorneys = result.items;
        this.attorneyDataSource = new MatTableDataSource(this.attorneys);
        this.attorneyDataSource.paginator = this.attorneyPaginator;
        this.attorneySort = this.attorneySort;
      });
  }
  deleteAttorney(entity: any) {
    this.editAttorneyRef.delete(entity);
    this.refresh();
  }
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.getLawFirm();
    this.getAttorneys();
    this.contactService.getByLawFirm(this.lawFirmId)
      .pipe(finalize(() => {

        finishedCallback();
      }))
      .subscribe((result) => {
        this.contacts = result.items;
        this.dataSource.data = this.contacts;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

    this.clientService.getAll(request.sorting, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => {

        finishedCallback();
      }))
      .subscribe((result) => {
        result.items.forEach((client) => {
          if (client.lawFirmId === this.lawFirmId) {
            this.clients.push(client);
          }
        });
        this.clientDataSource = new MatTableDataSource(this.clients);
        this.clientDataSource.paginator = this.clientPaginator;
        this.clientDataSource.sort = this.clientSort;
        this.showPaging(result, pageNumber);
      });
  }


  protected delete(entity: ContactListDto): void {
    abp.message.confirm(
      'Delete Contact \'' + entity.firstName + '\'?',
      (result: boolean) => {
        if (result) {
          this.contactService.delete(entity.id).pipe(finalize(() => {
            abp.notify.success('Deleted Contact: ' + entity.firstName);
            this.refresh();
          })).subscribe(() => { });
        }
      }
    );
  }

  protected deleteClient(entity: ClientListDto): void {
    abp.message.confirm(
      'Delete Client \'' + entity.firstName + ' ' + entity.lastName + '\'?',
      (result: boolean) => {
        if (result) {
          this.contactService.delete(entity.id).pipe(finalize(() => {
            abp.notify.success('Deleted Client: ' + entity.firstName + ' ' + entity.lastName);
            this.refresh();
          })).subscribe(() => { });
        }
      }
    );
  }

}
