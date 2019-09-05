import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Contact } from '../../attorneys/new-attorney/new-attorney.component';

@Component({
  selector: 'kt-new-contact',
  templateUrl: './new-contact.component.html',
  styleUrls: ['./new-contact.component.scss']
})
export class NewContactComponent implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Output() newContact = new EventEmitter();
  closeResult: string;
  contact: Contact = new Contact();
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
  contactAdded() {
    this.contact.id = 23;
    this.newContact.emit(this.contact);
    this.modalService.dismissAll();
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
