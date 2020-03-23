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
import { MatTabChangeEvent } from '@angular/material';

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
  leftHands: HandDto[] = [];
  rightHands: HandDto[] = [];
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
        this.isLoading = false;
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
    this.isLoading = true;
    this._rangeOfMotionService.getForearmWrist(this.clientId, 0)
      .pipe(finalize(() => {

      })).subscribe((result) => {
        this.leftForearmWrist = result;
      });
    this._rangeOfMotionService.getForearmWrist(this.clientId, 1)
      .pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe((result) => {
        this.rightForearmWrist = result;
      });
  }

  // Elbow
  getElbow() {
    this.isLoading = true;
    this._rangeOfMotionService.getElbow(this.clientId, 0)
      .pipe(finalize(() => {

      })).subscribe((result) => {
        this.leftElbow = result;
      });
    this._rangeOfMotionService.getElbow(this.clientId, 1)
      .pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe((result) => {
        this.rightElbow = result;
      });
  }


  // Hand
  getHand() {
    this.isLoading = true;
    this._rangeOfMotionService.getHand(this.clientId, 0)
      .pipe(finalize(() => {

      })).subscribe((result) => {
        this.leftHands = result.items;
      });
    this._rangeOfMotionService.getHand(this.clientId, 1)
      .pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe((result) => {
        this.rightHands = result.items;
      });
  }

  // Hip
  getHip() {
    this.isLoading = true;
    this._rangeOfMotionService.getHip(this.clientId, 0)
      .pipe(finalize(() => {

      })).subscribe((result) => {
        this.leftHip = result;
      });
    this._rangeOfMotionService.getHip(this.clientId, 1)
      .pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe((result) => {
        this.rightHip = result;
      });
  }


  // Knee
  getKnee() {
    this.isLoading = true;
    this._rangeOfMotionService.getKnee(this.clientId, 0)
      .pipe(finalize(() => {

      })).subscribe((result) => {
        this.leftKnee = result;
      });
    this._rangeOfMotionService.getKnee(this.clientId, 1)
      .pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe((result) => {
        this.rightKnee = result;
      });
  }

  // Ankle
  getAnkle() {
    this.isLoading = true;
    this._rangeOfMotionService.getAnkle(this.clientId, 0)
      .pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe((result) => {
        this.leftAnkle = result;
      });
    this._rangeOfMotionService.getAnkle(this.clientId, 1)
      .pipe(finalize(() => {

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
  handleTabChange(event: MatTabChangeEvent) {
    switch (event.index) {
      case 0:
        this.getShoulders();
        break;
      case 1:
        this.getForearmWrist();
        break;
      case 2:
        this.getElbow();
        break;
      case 3:
        this.getHand();
        break;
      case 4:
        this.getHip();
        break;
      case 5:
        this.getKnee();
        break;
      case 6:
        this.getAnkle();
        break;
      default:
        break;
    }

  }
}
