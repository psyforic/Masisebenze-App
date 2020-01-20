import { Component, OnInit, ViewChild, ElementRef, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-range-of-motion',
  templateUrl: './range-of-motion.component.html',
  styleUrls: ['./range-of-motion.component.scss']
})
export class RangeOfMotionComponent extends AppComponentBase implements OnInit {

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
