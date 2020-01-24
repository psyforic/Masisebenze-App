import { Component, OnInit, ViewChild, ElementRef, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentServiceProxy, GaitDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AssessmentService } from '@app/admin/services/assessment.service';

@Component({
  selector: 'app-gait',
  templateUrl: './gait.component.html',
  styleUrls: ['./gait.component.scss']
})
export class GaitComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() fullName: string;
  @Input() clientId: string;
  gait: GaitDto = new GaitDto();
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
    this.getGait();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  close() {
    this.activeModal.close();
  }
  getGait() {
    this.isLoading = true;
    this._assessmentService.getGait(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.gait = result;
      });
  }
  getResult(option: string) {
    const opt = Number.parseInt(option);
    return this._generalService.decodeGaitResult(opt);
  }
  getPain(option: string) {
    const opt = Number.parseInt(option);
    return this._generalService.decodeGaitPain(opt);
  }
  getObservation(option: string) {
    const opt = Number.parseInt(option);
    return this._generalService.decodeOtObservation(opt);
  }
  getTotalTIme(seconds: number): string {
    seconds = 360 - seconds;
    const minutes = Math.floor(seconds / 60);
    const sec = seconds - minutes * 60;
    return minutes + ' min. ' + sec + ' seconds';
  }
}
