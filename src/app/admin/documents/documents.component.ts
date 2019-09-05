import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

export interface File {
  id: number;
  name: string;
}

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit, AfterViewInit {


  uploadUrl: string;
  uploadedFiles: any[] = [];
  displayedColumns = ['select', 'id', 'name', 'status', 'actions'];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  selection = new SelectionModel<File>(true, []);
  dataSource: MatTableDataSource<File>;

  constructor() { }

  ngOnInit() {
    const documents: File[] = [
      { id: 1, name: 'Copy of Id or smartcard' }, { id: 2, name: 'Copy of passport' }, { id: 3, name: 'Power of attorney' },
      { id: 4, name: 'Various certificates', }, { id: 5, name: 'Employment certificate' }, { id: 6, name: 'Payslips' },
      { id: 7, name: 'Ambulance records' }, { id: 8, name: 'RAF4 Serious Injury Assessment Report' }, { id: 9, name: 'RAF1 Statutory medical report' },
      { id: 10, name: 'Narrative Test' }, { id: 11, name: 'Affidavit' }, { id: 12, name: 'Radiology report' }, { id: 13, name: 'Computer Programmer' },
      { id: 14, name: 'Supplementary Medico Legal Report Orthopaedic surgeon' }, { id: 15, name: 'Referral letter' },
      { id: 16, name: 'Hospital records' }, { id: 17, name: 'Consultation notes' }, { id: 18, name: 'Medico Legal Report Industrial Psychologist' },
      { id: 19, name: 'Medico Legal Report Clinical Psychologist' }, { id: 20, name: 'Medico Legal Report Neurosurgeon' },
      { id: 21, name: 'Medico Legal Report Plastic surgeon' }, { id: 22, name: 'Medico Legal Report Urologist' }, { id: 23, name: 'Medico Legal Report Ophthalmologist' },
      { id: 24, name: 'Medico Legal Report Biokineticist' }, { id: 25, name: 'Medico Legal Report Speech and Language Therapist' },
      { id: 26, name: 'Clinical notes' }, { id: 27, name: 'Photos depicting the injuries' }, { id: 28, name: '28.	First medical report' },
      { id: 29, name: '29.	Progress medical report' }, { id: 30, name: 'Financial Medical Report' }, { id: 31, name: 'Sick Report' }
    ];
    this.dataSource = new MatTableDataSource(documents);
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // upload completed event
  onUpload(event): void {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  onBeforeSend(event): void {
    event.xhr.setRequestHeader('Authorization', 'Bearer ');
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
  checkboxLabel(row?: File): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

}
