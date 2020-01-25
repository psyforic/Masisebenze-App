import { Component, OnInit, ViewChild, ElementRef, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-repetitive-tolerance-protocol',
  templateUrl: './repetitive-tolerance-protocol.component.html',
  styleUrls: ['./repetitive-tolerance-protocol.component.scss']
})
export class RepetitiveToleranceProtocolComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() fullName: string;
  @Input() clientId: string;
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
