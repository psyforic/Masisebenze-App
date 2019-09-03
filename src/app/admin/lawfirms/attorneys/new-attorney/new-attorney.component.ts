import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NewContactComponent } from '../new-contact/new-contact.component';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

export class Contact {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	constructor() {
	}
}
@Component({
	selector: 'kt-new-attorney',
	templateUrl: './new-attorney.component.html',
	styleUrls: ['./new-attorney.component.scss']
})
export class NewAttorneyComponent implements OnInit, AfterViewInit {

	dataSource: MatTableDataSource<Contact>;
	contacts: Contact[] = [];
	displayedColumns = ['id', 'firstName', 'lastName', 'email', 'phone', 'actions'];

	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;
	@ViewChild('newContact', { static: false }) newContactRef: NewContactComponent;
	ngOnInit(): void {
	}
	ngAfterViewInit(): void {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	addContact() {
		this.newContactRef.open();
	}
	displayContact(contact: Contact) {
		this.contacts.push(contact);
		this.dataSource = new MatTableDataSource(this.contacts);
	}
}
