import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NewAttorneyComponent } from './new-attorney/new-attorney.component';
import { EditAttorneyComponent } from './edit-attorney/edit-attorney.component';
import { Router } from '@angular/router';

export interface User {
  id: number;
  email: string;
  fullName: string;
}
@Component({
  selector: 'app-attorneys',
  templateUrl: './attorneys.component.html',
  styleUrls: ['./attorneys.component.scss']
})
export class AttorneysComponent implements OnInit, AfterViewInit {


  dataSource: MatTableDataSource<User>;
  displayedColumns = ['attNo', 'fullName', 'email', 'actions'];


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('newAttorney', { static: true }) newAttorney: NewAttorneyComponent;
  @ViewChild('editAttorney', { static: true }) editAttorney: EditAttorneyComponent;

  constructor(private router: Router) {

  }

  ngOnInit() {
    const users: User[] = [
      { id: 1, email: 'attorney@email.com', fullName: 'Adams Attorneys' },
      { id: 2, email: 'attorney@email.com', fullName: 'Mani Attorneys' },
      { id: 3, email: 'attorney@email.com', fullName: 'Jafta Attorneys' }
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
  createNewAttorney() {
    this.router.navigate(['./new']);
  }
  editSelectedAttorney() {
    this.editAttorney.open();
  }

}
