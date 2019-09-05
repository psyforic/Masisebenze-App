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
  ClientListDto
} from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-view-lawfirm',
  templateUrl: './view-lawfirm.component.html',
  styleUrls: ['./view-lawfirm.component.scss'],
  providers: [LawFirmServiceProxy, ContactServiceProxy, ClientServiceProxy]
})
export class ViewLawfirmComponent extends PagedListingComponentBase<ContactListDto> implements AfterViewInit {

  dataSource: MatTableDataSource<ContactListDto> = new MatTableDataSource<ContactListDto>();
  clientDataSource: MatTableDataSource<ClientListDto> = new MatTableDataSource<ClientListDto>();
  contacts: ContactListDto[] = [];
  clients: ClientListDto[] = [];
  displayedColumns = ['firstName', 'lastName', 'email', 'role', 'actions'];
  clientDisplayedColumns = ['id', 'firstName', 'lastName', 'dob', 'age', 'dateOfInjury', 'actions'];
  lawFirmId: string;
  lawFirm: LawFirmDetailOutput = new LawFirmDetailOutput();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) clientPaginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) clientSort: MatSort;
  @ViewChild('newContact', { static: false }) newContactRef: NewContactComponent;
  @ViewChild('newClient', { static: false }) newClientRef: NewClientComponent;

  constructor(private injector: Injector,
    private route: ActivatedRoute,
    private lawFimService: LawFirmServiceProxy,
    private contactService: ContactServiceProxy,
    private clientService: ClientServiceProxy) {
    super(injector);
    this.route.paramMap.subscribe((paramMap) => {
      this.lawFirmId = paramMap.get('id');
      this.getLawFirm();
    });
  }
  getLawFirm() {
    this.lawFimService.getDetail(this.lawFirmId).subscribe((result) => {
      this.lawFirm = result;
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.clientDataSource.paginator = this.clientPaginator;
    this.clientDataSource.sort = this.clientSort;
    this.refresh();
  }
  addContact() {
    this.newContactRef.open();
  }
  addClient() {
    this.newClientRef.open();
  }
  displayContact(contact) {
    this.refresh();
    this.dataSource._updateChangeSubscription();

  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.clientDataSource.filter = filterValue;
  }
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.contactService.getAll(request.sorting, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => {
        finishedCallback();
      }))
      .subscribe((result) => {
        result.items.forEach((value) => {
          if (value.lawFirmId === this.lawFirmId) {
            this.contacts.push(value);
          }
        });
        this.dataSource = new MatTableDataSource(this.contacts);
        this.showPaging(result, pageNumber);
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
