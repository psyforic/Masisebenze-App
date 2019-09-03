import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NewContactComponent } from '../new-contact/new-contact.component';
import { NewClientComponent } from '../new-client/new-client.component';

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
  selector: 'kt-view-attorney',
  templateUrl: './view-attorney.component.html',
  styleUrls: ['./view-attorney.component.scss']
})
export class ViewAttorneyComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Contact>;
  clientDataSource: MatTableDataSource<Client>;
  contacts: Contact[] = [];
  clients: Client[] = [];
  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'phone', 'actions'];
  clientDisplayedColumns = ['id', 'firstName', 'lastName', 'dob', 'age', 'dateOfInjury', 'actions'];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) clientPaginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) clientSort: MatSort;
  @ViewChild('newContact', { static: false }) newContactRef: NewContactComponent;
  @ViewChild('newClient', { static: false }) newClientRef: NewClientComponent;
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
