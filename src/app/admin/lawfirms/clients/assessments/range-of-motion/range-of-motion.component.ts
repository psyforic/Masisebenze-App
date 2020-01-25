import { Component, OnInit, ViewChild, ElementRef, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  RangeOfMotionServiceProxy,
  ShoulderDto,
  ForearmWristDto,
  ElbowDto,
  HandDto,
  HipDto,
  KneeDto,
  AnkleDto
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AssessmentService } from '@app/admin/services/assessment.service';

@Component({
  selector: 'app-range-of-motion',
  templateUrl: './range-of-motion.component.html',
  styleUrls: ['./range-of-motion.component.scss'],
  providers: [RangeOfMotionServiceProxy]
})
export class RangeOfMotionComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() fullName: string;
  @Input() clientId: string;
  leftShoulder: ShoulderDto = new ShoulderDto();
  rightShoulder: ShoulderDto = new ShoulderDto();
  leftForearmWrist: ForearmWristDto = new ForearmWristDto();
  rightForearmWrist: ForearmWristDto = new ForearmWristDto();
  leftElbow: ElbowDto = new ElbowDto();
  rightElbow: ElbowDto = new ElbowDto();
  leftHand: HandDto = new HandDto();
  rightHand: HandDto = new HandDto();
  leftHip: HipDto = new HipDto();
  rightHip: HipDto = new HipDto();
  leftKnee: KneeDto = new KneeDto();
  rightKnee: KneeDto = new KneeDto();
  leftAnkle: AnkleDto = new AnkleDto();
  rightAnkle: AnkleDto = new AnkleDto();
  isLoading = false;
  constructor(
    private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _rangeOfMotionService: RangeOfMotionServiceProxy,
    private _generalService: AssessmentService) {
    super(injector);
  }

  ngOnInit() {
  }
  open() {
    this.getShoulders();
    this.getForearmWrist();
    this.getForearmWrist();
    this.getElbow();
    this.getHand();
    this.getHip();
    this.getKnee();
    this.getAnkle();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false, size: 'xl' })
      .result.then(() => { }, () => { });
  }
  close() {
    this.activeModal.close();
  }

  // Shoulder
  getShoulders() {
    this.isLoading = true;
    this._rangeOfMotionService.getShoulder(this.clientId, 0)
      .pipe(finalize(() => {

      }))
      .subscribe((result) => {
        this.leftShoulder = result;
      });
    this._rangeOfMotionService.getShoulder(this.clientId, 1)
      .pipe(finalize(() => {

      }))
      .subscribe((result) => {
        this.rightShoulder = result;
      });
  }

  // Forearm & Wrist
  getForearmWrist() {
    this._rangeOfMotionService.getForearmWrist(this.clientId, 0)
      .pipe(finalize(() => {

      })).subscribe((result) => {
        this.leftForearmWrist = result;
      });
    this._rangeOfMotionService.getForearmWrist(this.clientId, 1)
      .pipe(finalize(() => {

      })).subscribe((result) => {
        this.rightForearmWrist = result;
      });
  }

  // Elbow
  getElbow() {
    this._rangeOfMotionService.getElbow(this.clientId, 0)
      .pipe(finalize(() => {

      })).subscribe((result) => {
        this.leftElbow = result;
      });
    this._rangeOfMotionService.getElbow(this.clientId, 1)
      .pipe(finalize(() => {

      })).subscribe((result) => {
        this.rightElbow = result;
      });
  }


  // Hand
  getHand() {
    this._rangeOfMotionService.getHand(this.clientId, 0)
      .pipe(finalize(() => {

      })).subscribe((result) => {
        this.leftHand = result;
      });
    this._rangeOfMotionService.getHand(this.clientId, 1)
      .pipe(finalize(() => {

      })).subscribe((result) => {
        this.rightHand = result;
      });
  }

  // Hip
  getHip() {
    this._rangeOfMotionService.getHip(this.clientId, 0)
      .pipe(finalize(() => {

      })).subscribe((result) => {
        this.leftHip = result;
      });
    this._rangeOfMotionService.getHip(this.clientId, 1)
      .pipe(finalize(() => {

      })).subscribe((result) => {
        this.rightHip = result;
      });
  }


  // Knee
  getKnee() {
    this._rangeOfMotionService.getKnee(this.clientId, 0)
      .pipe(finalize(() => {

      })).subscribe((result) => {
        this.leftKnee = result;
      });
    this._rangeOfMotionService.getKnee(this.clientId, 1)
      .pipe(finalize(() => {

      })).subscribe((result) => {
        this.rightKnee = result;
      });
  }

  // Ankle
  getAnkle() {
    this._rangeOfMotionService.getAnkle(this.clientId, 0)
      .pipe(finalize(() => {

      })).subscribe((result) => {
        this.leftAnkle = result;
      });
    this._rangeOfMotionService.getAnkle(this.clientId, 1)
      .pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe((result) => {
        this.rightAnkle = result;
      });
  }

  decodePainLevel(option: number) {
    return this._generalService.getPain(option);
  }

  getHandResult(option: number) {
    return this._generalService.decodeRoMHandOption(option);
  }
}
