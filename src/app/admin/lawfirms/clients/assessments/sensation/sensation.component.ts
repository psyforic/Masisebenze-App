import { Component, OnInit, ViewChild, ElementRef, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sensation',
  templateUrl: './sensation.component.html',
  styleUrls: ['./sensation.component.scss']
})
export class SensationComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;

  constructor(
    private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    super(injector);
  }

  ngOnInit() {
  }
  open() {
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  close() {
    this.activeModal.close();
  }

}
