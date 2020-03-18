import { MusclePowerServiceProxy } from './../../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, ViewChild, ElementRef, Injector, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponentBase } from '@shared/app-component-base';
import { AssessmentServiceProxy, MusclePowerOptionDto } from '@shared/service-proxies/service-proxies';
import { AssessmentService } from '@app/admin/services/assessment.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-muscle-power',
  templateUrl: './muscle-power.component.html',
  styleUrls: ['./muscle-power.component.scss'],
  providers: [MusclePowerServiceProxy]
})
export class MusclePowerComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() clientId: string;
  @Input() fullName: string;
  leftArm: MusclePowerOptionDto = new MusclePowerOptionDto();
  rightArm: MusclePowerOptionDto = new MusclePowerOptionDto();
  leftLeg: MusclePowerOptionDto = new MusclePowerOptionDto();
  rightLeg: MusclePowerOptionDto = new MusclePowerOptionDto();
  isLoading = false;
  constructor(
    private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _assessmentService: AssessmentServiceProxy,
    private _musclePowerService: MusclePowerServiceProxy,
    private _generalService: AssessmentService) {
    super(injector);
  }

  ngOnInit() {
  }
  open() {
    this.getMusclePower();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false, size: 'xl' })
      .result.then(() => { }, () => { });
  }
  close() {
    this.activeModal.close();
  }
  getMusclePower() {
    this.isLoading = true;
    this._musclePowerService.getMusclePowerOption(this.clientId, 0)
      .subscribe((result) => {
        this.rightArm = result;
      });
    this._musclePowerService.getMusclePowerOption(this.clientId, 1)
      .subscribe((result) => {
        this.leftArm = result;
      });
    this._musclePowerService.getMusclePowerOption(this.clientId, 2)
      .subscribe((result) => {
        this.rightLeg = result;
      });
    this._musclePowerService.getMusclePowerOption(this.clientId, 3)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.leftLeg = result;
      });
  }
  decodeResult(option: number) {
    return this._generalService.getMusclePowerOptions(option);
  }
  decodePainLevel(painLevel: number) {
    return this._generalService.getPain(painLevel);
  }

}
