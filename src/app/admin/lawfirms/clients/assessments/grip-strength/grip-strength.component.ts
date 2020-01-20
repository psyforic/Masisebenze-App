import { Component, OnInit, Injector, ViewChild, ElementRef, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralService } from '@app/admin/services/general.service';
import { AssessmentService } from '@app/admin/services/assessment.service';
import { GripStrengthDto } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-grip-strength',
  templateUrl: './grip-strength.component.html',
  styleUrls: ['./grip-strength.component.scss']
})
export class GripStrengthComponent extends AppComponentBase implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() clientId: string;
  gripStrengthLeft: GripStrengthDto = new GripStrengthDto();
  gripStrengthRight: GripStrengthDto = new GripStrengthDto();
  constructor(
    private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _assessmentService: AssessmentService) {
    super(injector);
  }

  ngOnInit() {
  }
  open() {
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => {
        this.getGripStrength();
      }, () => { });
  }
  close() {
    this.activeModal.close();
  }
  getGripStrength() {
    this.gripStrengthLeft = this._assessmentService.getGripStrength(this.clientId, 0);
    this.gripStrengthRight = this._assessmentService.getGripStrength(this.clientId, 1);
  }
}
