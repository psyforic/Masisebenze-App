import { Component, OnInit, ViewChild, ElementRef, Injector } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-muscle-power',
  templateUrl: './muscle-power.component.html',
  styleUrls: ['./muscle-power.component.scss']
})
export class MusclePowerComponent extends AppComponentBase implements OnInit {

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
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false, size: 'xl' })
      .result.then(() => { }, () => { });
  }
  close() {
    this.activeModal.close();
  }
}
