import { Component, OnInit, ViewChild, ElementRef, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CoordinationOptionListDto,
  CalculationsServiceProxy,
  AssessmentResult,
  CoordinationServiceProxy,
  CoordinationIncompleteServiceProxy,
  CoordinationIncompleteDto
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-coordination',
  templateUrl: './coordination.component.html',
  styleUrls: ['./coordination.component.scss'],
  providers: [CalculationsServiceProxy, CoordinationServiceProxy, CoordinationIncompleteServiceProxy]
})
export class CoordinationComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() fullName: string;
  @Input() clientId: string;
  isLoading = false;
  current_step_sitting = 1;
  current_step_standing = 1;
  MAX_STEP = 4;
  types: number[] = [1, 0, 3, 2];
  result: AssessmentResult = new AssessmentResult();
  coordinationSittingOptions: CoordinationOptionListDto[] = [];
  coordinationStandingOptions: CoordinationOptionListDto[] = [];
  coordinationIncomplete: CoordinationIncompleteDto = new CoordinationIncompleteDto();
  constructor(
    injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _coordinationService: CoordinationServiceProxy,
    private _ccordinationIncompleteService: CoordinationIncompleteServiceProxy,
    private calculationService: CalculationsServiceProxy) {
    super(injector);
  }

  ngOnInit() {
  }
  open() {
    this.getCoordinationSitting();
    this.getCoordinationStanding();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  close() {
    this.activeModal.close();
  }
  getCoordinationSitting() {
    this.isLoading = true;
    this._coordinationService.getCoordination(this.clientId, 0)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.getResult(this.formatTime(this.coordinationSittingOptions[this.current_step_sitting - 1].time), this.current_step_sitting);
      }))
      .subscribe((result) => {
        this.coordinationSittingOptions = result.items;
      });
  }
  getCoordinationStanding() {
    this.isLoading = true;
    this._coordinationService.getCoordination(this.clientId, 1)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.getResult(this.formatTime(this.coordinationStandingOptions[this.current_step_standing - 1].time), this.current_step_standing);
      }))
      .subscribe(result => {
        this.coordinationStandingOptions = result.items;
      });
  }
  getCoordinationIncomplete() {
    this.isLoading = true;
    this._ccordinationIncompleteService.getCoordinationIncomplete(this.clientId, 0)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(result => {
        this.coordinationIncomplete = result;
      });
  }
  getResult(seconds: number, current_step: number) {
    this.isLoading = true;
    this.calculationService.getCoordinationCompleteResults(seconds, this.types[current_step - 1])
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.result = result;
      });
  }
  handleTabChange(event: MatTabChangeEvent) {
    if (event.index === 2) {
      this.getCoordinationIncomplete();
    }
  }
  nextSitting() {
    if (this.current_step_sitting !== this.MAX_STEP) {
      this.current_step_sitting++;
      this.getResult(this.formatTime(this.coordinationSittingOptions[this.current_step_sitting - 1].time), this.current_step_sitting);
    }
  }
  prevSitting() {
    if (this.current_step_sitting !== 1) {
      this.current_step_sitting--;
      this.getResult(this.formatTime(this.coordinationSittingOptions[this.current_step_sitting - 1].time), this.current_step_sitting);
    }
  }

  nextStanding() {
    if (this.current_step_standing !== this.MAX_STEP) {
      this.current_step_standing++;
      this.getResult(this.formatTime(this.coordinationStandingOptions[this.current_step_standing - 1].time), this.current_step_standing);
    }
  }
  prevStanding() {
    if (this.current_step_standing !== 1) {
      this.current_step_standing--;
      this.getResult(this.formatTime(this.coordinationStandingOptions[this.current_step_standing - 1].time), this.current_step_standing);
    }
  }
  formatTime(time: number): number {
    return time == null || undefined ? 0 : time;
  }
  isShown(): boolean {
    return this.coordinationIncomplete.status == null || undefined ? false : true;
  }
}
