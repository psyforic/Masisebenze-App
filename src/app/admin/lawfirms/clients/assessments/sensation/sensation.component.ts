import { Component, OnInit, ViewChild, ElementRef, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentServiceProxy, SensationOptionDto } from '@shared/service-proxies/service-proxies';
import { AssessmentService } from '@app/admin/services/assessment.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-sensation',
  templateUrl: './sensation.component.html',
  styleUrls: ['./sensation.component.scss']
})
export class SensationComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() fullName: string;
  @Input() clientId: string;
  upperLeftSide: SensationOptionDto[] = [];
  upperRightSide: SensationOptionDto[] = [];
  trunkLeftSide: SensationOptionDto[] = [];
  trunkRightSide: SensationOptionDto[] = [];
  lowerLeftSide: SensationOptionDto[] = [];
  lowerRightSide: SensationOptionDto[] = [];
  upper_left_current_step = 1;
  upper_right_current_step = 1;
  trunk_left_current_step = 1;
  trunk_right_current_step = 1;
  lower_left_current_step = 1;
  lower_right_current_step = 1;
  MAX_STEP_UPPER = 8;
  MAX_STEP_LOWER = 7;
  MAX_STEP_TRUNK = 5;
  isLoading = false;

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
    this.getUpperExtremity();
    this.getLowerExtremity();
    this.getTrunkExtremity();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false, size: 'xl' })
      .result.then(() => { }, () => { });
  }
  close() {
    this.activeModal.close();
  }
  getUpperExtremity() {
    this.isLoading = true;
    this._assessmentService.getUpperExtremity(this.clientId, 0)
      .pipe(finalize(() => {

      }))
      .subscribe(result => {
        this.upperLeftSide = result.items;
      });

    this._assessmentService.getUpperExtremity(this.clientId, 1)
      .pipe(finalize(() => {

      }))
      .subscribe(result => {
        this.upperRightSide = result.items;
      });
  }
  getTrunkExtremity() {
    this._assessmentService.getTrunkExtremity(this.clientId, 0)
      .pipe(finalize(() => {

      }))
      .subscribe(result => {
        this.trunkLeftSide = result.items;
      });

    this._assessmentService.getTrunkExtremity(this.clientId, 1)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(result => {
        this.trunkRightSide = result.items;
      });
  }


  getLowerExtremity() {
    this._assessmentService.getLowerExtremity(this.clientId, 0)
      .pipe(finalize(() => {

      }))
      .subscribe(result => {
        this.lowerLeftSide = result.items;
      });

    this._assessmentService.getLowerExtremity(this.clientId, 1)
      .pipe(finalize(() => {

      }))
      .subscribe(result => {
        this.lowerRightSide = result.items;
      });
  }
  nextUpperLeft() {
    if (this.upper_left_current_step !== this.MAX_STEP_UPPER) {
      this.upper_left_current_step++;
    }
  }
  prevUpperLeft() {
    if (this.upper_left_current_step !== 1) {
      this.upper_left_current_step--;
    }
  }
  nextUpperRight() {
    if (this.upper_right_current_step !== this.MAX_STEP_UPPER) {
      this.upper_right_current_step++;
    }
  }
  prevUpperRight() {
    if (this.upper_right_current_step !== 1) {
      this.upper_right_current_step--;
    }
  }



  nextTrunkLeft() {
    if (this.trunk_left_current_step !== this.MAX_STEP_TRUNK) {
      this.trunk_left_current_step++;
    }
  }
  prevTrunkLeft() {
    if (this.trunk_left_current_step !== 1) {
      this.trunk_left_current_step--;
    }
  }
  nextTrunkRight() {
    if (this.trunk_right_current_step !== this.MAX_STEP_TRUNK) {
      this.trunk_right_current_step++;
    }
  }
  prevTrunkRight() {
    if (this.trunk_right_current_step !== 1) {
      this.trunk_right_current_step--;
    }
  }


  nextLowerLeft() {
    if (this.lower_left_current_step !== this.MAX_STEP_LOWER) {
      this.lower_left_current_step++;
    }
  }
  prevLowerLeft() {
    if (this.lower_left_current_step !== 1) {
      this.lower_left_current_step--;
    }
  }
  nextLowerRight() {
    if (this.lower_right_current_step !== this.MAX_STEP_LOWER) {
      this.lower_right_current_step++;
    }
  }
  prevLowerRight() {
    if (this.lower_right_current_step !== 1) {
      this.lower_right_current_step--;
    }
  }

  getResult(option: number) {
    return this._generalService.decodeSensationOption(option);
  }
  getPain(option: number) {
    return this._generalService.getPain(option);
  }
  getHandOption(option: number) {
    return this._generalService.decodeRoMHandOption(option);
  }

}
