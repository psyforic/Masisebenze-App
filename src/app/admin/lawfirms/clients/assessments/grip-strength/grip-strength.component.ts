import { Component, OnInit, Injector, ViewChild, ElementRef, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  GripStrengthDto,
  AssessmentServiceProxy,
  CalculationsServiceProxy,
  AssessmentResult
} from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-grip-strength',
  templateUrl: './grip-strength.component.html',
  styleUrls: ['./grip-strength.component.scss'],
  providers: [CalculationsServiceProxy]
})
export class GripStrengthComponent extends AppComponentBase implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() clientId: string;
  @Input() age: number;
  @Input() gender: string;
  numAge: number;
  gripStrengthLeft: GripStrengthDto = new GripStrengthDto();
  gripStrengthRight: GripStrengthDto = new GripStrengthDto();
  leftResult: AssessmentResult = new AssessmentResult();
  rightResult: AssessmentResult = new AssessmentResult();
  constructor(
    private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _assessmentService: AssessmentServiceProxy,
    private _calculationService: CalculationsServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    if (this.gender === 'Female') {
      this.numAge = 0;
    } else {
      this.numAge = 1;
    }
    this.getGripStrength();
  }
  open() {
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false, size: 'lg' })
      .result.then(() => {

      }, () => {
      });

    // this.getResult();
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
  getPain(painLevel: number) {
    switch (painLevel) {
      case 0:
        return 'No Pain';
      case 1:
        return 'Hurts a Little';
      case 2:
        return 'Hurts a Little More';
      case 3:
        return 'Hurts Even More';
      case 4:
        return 'Hurts a Whole Lot';
      case 5:
        return 'Hurts Worse';
      default:
        return '';
        break;
    }
  }
  getResult() {
    this._calculationService
      .getGripStrengthResults(this.age, this.numAge, 0, 40, 55)
      .subscribe((result) => {
        this.leftResult = result;
      });
    this._calculationService
      .getGripStrengthResults(this.age, this.numAge, 1, 40, 55)
      .subscribe((result) => {
        this.rightResult = result;
      });
  }
}
