import { Component, OnInit, ViewChild, ElementRef, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentServiceProxy } from '@shared/service-proxies/service-proxies';
import { AssessmentService } from '@app/admin/services/assessment.service';

@Component({
  selector: 'app-sensation',
  templateUrl: './sensation.component.html',
  styleUrls: ['./sensation.component.scss']
})
export class SensationComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() fullName: string;
  @Input() clientId: string;
  constructor(
    private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _assessmentService: AssessmentServiceProxy,
    private _generalService: AssessmentService) {
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
