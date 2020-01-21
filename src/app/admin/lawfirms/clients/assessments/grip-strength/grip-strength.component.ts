import { Component, OnInit, Injector, ViewChild, ElementRef, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GripStrengthDto, AssessmentServiceProxy } from '@shared/service-proxies/service-proxies';

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
    private _assessmentService: AssessmentServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    this.getGripStrength();
  }
  open() {
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => {
      }, () => {
      });

  }
  close() {
    this.activeModal.close();
  }
  getGripStrength() {
    this._assessmentService.getGripStrength(this.clientId, 0)
      .subscribe(result => {
        this.gripStrengthLeft = result;
      });
    this._assessmentService.getGripStrength(this.clientId, 1)
      .subscribe(result => {
        this.gripStrengthRight = result;
      });
  }
}
