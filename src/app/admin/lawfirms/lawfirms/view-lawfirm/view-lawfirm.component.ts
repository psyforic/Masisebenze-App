import { Component, OnInit, ViewChild, AfterViewInit, Injector } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NewContactComponent } from '../new-contact/new-contact.component';
import { NewClientComponent } from '../new-client/new-client.component';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { LawFirmServiceProxy, LawFirmDetailOutput } from '@shared/service-proxies/service-proxies';

export class Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  constructor() {
  }
}
export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  dob: string;
  age: number;
  dateOfInjury: string;
}
@Component({
  selector: 'app-view-lawfirm',
  templateUrl: './view-lawfirm.component.html',
  styleUrls: ['./view-lawfirm.component.scss'],
  providers: [LawFirmServiceProxy]
})
export class ViewLawfirmComponent extends AppComponentBase implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<Contact>;
  clientDataSource: MatTableDataSource<Client>;
  contacts: Contact[] = [];
  clients: Client[] = [];
  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'phone', 'actions'];
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
    private lawFimService: LawFirmServiceProxy) {
    super(injector);
    this.route.paramMap.subscribe((paramMap) => {
      this.lawFirmId = paramMap.get('id');
      this.getLawFirm();
    });
  }
  ngOnInit(): void {
    this.contacts = [
      { id: 1, firstName: 'Lundi', lastName: 'Mapundu', email: 'lundi@mapundu.co.za', phone: '0749183210' },
      { id: 2, firstName: 'Lundi', lastName: 'Mapundu', email: 'lundi@developmenthub.co.za', phone: '0791602233' }
    ];
    this.dataSource = new MatTableDataSource(this.contacts);

    this.clients = [
      { id: 1, firstName: 'Johan', lastName: 'Schaeffer', dob: '29 July 1977', age: 42, dateOfInjury: '23 October 2018' },
      { id: 2, firstName: 'Xola', lastName: 'Gqulu', dob: '13 March 1990', age: 29, dateOfInjury: '09 March 2019' },
      { id: 3, firstName: 'Sivuyile', lastName: 'Gonondo', dob: '08 September 1969', age: 49, dateOfInjury: '29 September 2018' },
      { id: 4, firstName: 'Gert', lastName: 'Adams', dob: '23 December 1997', age: 21, dateOfInjury: '14 July 2015' }
    ];
    this.clientDataSource = new MatTableDataSource(this.clients);
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
  }
  addContact() {
    this.newContactRef.open();
  }
  addClient() {
    this.newClientRef.open();
  }
  displayContact(contact: Contact) {
    console.log('Contact', contact);
    this.contacts.push(contact);
    this.dataSource._updateChangeSubscription();

  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.clientDataSource.filter = filterValue;
  }
}
