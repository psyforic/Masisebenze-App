import { Component, OnInit, Injector, ViewChild, ElementRef, Input } from '@angular/core';
import { ClientDetailOutput, ClientServiceProxy, AssessmentServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-affect',
  templateUrl: './affect.component.html',
  styleUrls: ['./affect.component.scss']
})
export class AffectComponent extends AppComponentBase implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  client: ClientDetailOutput = new ClientDetailOutput();
  @Input() fullName: string;
  @Input() clientId: string;

  isLoading = false;
  constructor(
    private _clientService: ClientServiceProxy,
    private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _assessmentService: AssessmentServiceProxy, ) {
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
