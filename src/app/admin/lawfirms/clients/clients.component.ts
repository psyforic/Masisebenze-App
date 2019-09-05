import { Component, OnInit, AfterViewChecked, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NewClientComponent } from '../lawfirms/new-client/new-client.component';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  dob: string;
  age: number;
  dateOfInjury: string;
}
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<User>;
  displayedColumns = ['id', 'firstName', 'lastName', 'dob', 'age', 'dateOfInjury', 'actions'];

  @ViewChild('newClient', { static: false }) newClientRef: NewClientComponent;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  constructor() {

  }
  ngOnInit() {
    const users: User[] = [
      { id: 1, firstName: 'Johan', lastName: 'Schaeffer', dob: '29 July 1977', age: 42, dateOfInjury: '23 October 2018' },
      { id: 2, firstName: 'Xola', lastName: 'Gqulu', dob: '13 March 1990', age: 29, dateOfInjury: '09 March 2019' },
      { id: 3, firstName: 'Sivuyile', lastName: 'Gonondo', dob: '08 September 1969', age: 49, dateOfInjury: '29 September 2018' },
      { id: 4, firstName: 'Gert', lastName: 'Adams', dob: '23 December 1997', age: 21, dateOfInjury: '14 July 2015' }
    ];
    this.dataSource = new MatTableDataSource(users);

  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  createClient() {
    this.newClientRef.open();
  }
}
