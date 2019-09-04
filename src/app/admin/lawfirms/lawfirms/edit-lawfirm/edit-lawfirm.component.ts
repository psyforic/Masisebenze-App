import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import {LawFirmDetailOutput } from '@shared/service-proxies/service-proxies';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-lawfirm',
  templateUrl: './edit-lawfirm.component.html',
  styleUrls: ['./edit-lawfirm.component.scss']
})
export class EditLawfirmComponent implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  @Output() newContact = new EventEmitter();
  closeResult: string;
  lawFirm: LawFirmDetailOutput = new LawFirmDetailOutput();
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
    this.newContact.emit(this.lawFirm);
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
