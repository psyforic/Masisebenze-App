import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss']
})
export class NewClientComponent implements OnInit {

  @ViewChild('content', { static: true }) content: ElementRef;
  modalRef: BsModalRef;
  closeResult: string;
  constructor(private modalService: BsModalService) { }
  ngOnInit(): void {
   
  }

  open() {
    this.modalRef = this.modalService.show(this.content);
  }
}
