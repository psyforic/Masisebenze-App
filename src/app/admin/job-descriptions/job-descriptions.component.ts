import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { EditJobDescriptionComponent } from './edit-job-description/edit-job-description.component';
import { NewJobDescriptionComponent } from './new-job-description/new-job-description.component';

export interface Job {
  id: number;
  name: string;
}
@Component({
  selector: 'app-job-descriptions',
  templateUrl: './job-descriptions.component.html',
  styleUrls: ['./job-descriptions.component.scss']
})
export class JobDescriptionsComponent implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<Job>;
  displayedColumns = ['id', 'name', 'actions'];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('editJob', { static: false }) editJob: EditJobDescriptionComponent;
  @ViewChild('newJob', { static: false }) newJob: NewJobDescriptionComponent;
  constructor() {

  }
  ngOnInit() {
    const jobs: Job[] = [
      { id: 1, name: 'Nursing Assistant' },
      { id: 2, name: 'Dog Trainer' },
      { id: 3, name: 'Librarian' },
      { id: 4, name: 'Copywriter', },
      { id: 5, name: 'Secretary' },
      { id: 6, name: 'Receptionist' },
      { id: 7, name: 'Foreman' },
      { id: 8, name: 'Superintendent', },
      { id: 9, name: 'Foreman' },
      { id: 10, name: 'Computer Programmer' }
    ];
    this.dataSource = new MatTableDataSource(jobs);

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
  editJobTitle() {
    this.editJob.open();
  }
  newJobTitle() {
    this.newJob.open();
  }

}
