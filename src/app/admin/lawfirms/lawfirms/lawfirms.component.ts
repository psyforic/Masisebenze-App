import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { NewAttorneyComponent } from '../attorneys/new-attorney/new-attorney.component';
import { EditAttorneyComponent } from '../attorneys/edit-attorney/edit-attorney.component';
import { NewLawfirmComponent } from './new-lawfirm/new-lawfirm.component';
import { EditLawfirmComponent } from './edit-lawfirm/edit-lawfirm.component';

export interface User {
  id: number;
  email: string;
  fullName: string;
}
@Component({
  selector: 'app-lawfirms',
  templateUrl: './lawfirms.component.html',
  styleUrls: ['./lawfirms.component.scss']
})
export class LawfirmsComponent implements OnInit, AfterViewInit {


  dataSource: MatTableDataSource<User>;
  displayedColumns = ['attNo', 'fullName', 'email', 'actions'];


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('newLawFirm', { static: true }) newLawFirm: NewLawfirmComponent;
  @ViewChild('editLawFirm', { static: true }) editLawFirm: EditLawfirmComponent;

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
  createNewLawFirm() {
    this.newLawFirm.open();
  }
  editSelectedLawFirm() {
    this.editLawFirm.open();
  }

}
