import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-new-job-description',
  templateUrl: './new-job-description.component.html',
  styleUrls: ['./new-job-description.component.scss']
})
export class NewJobDescriptionComponent implements OnInit {

  @ViewChild('content', {static: true}) content: ElementRef;
  modalRef: BsModalRef;
  closeResult: string;
  constructor(private modalService: BsModalService) { }
  ngOnInit(): void {

  }

  open() {
    this.modalRef = this.modalService.show(this.content);
  }
}
