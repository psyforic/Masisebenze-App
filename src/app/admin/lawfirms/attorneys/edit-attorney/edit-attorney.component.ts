import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'kt-edit-attorney',
	templateUrl: './edit-attorney.component.html',
	styleUrls: ['./edit-attorney.component.scss']
})
export class EditAttorneyComponent implements OnInit {

	@ViewChild('content', { static: false }) content: ElementRef;
	closeResult: string;
	constructor(private modalService: NgbModal) { }
	ngOnInit(): void {

	}

	open() {
		this.modalService.open(this.content).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}


}
