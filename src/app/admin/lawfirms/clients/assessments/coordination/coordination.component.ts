import { Component, OnInit, ViewChild, ElementRef, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AssessmentServiceProxy,
  CoordinationOptionListDto,
  CalculationsServiceProxy,
  AssessmentResult,
  CoordinationServiceProxy
} from '@shared/service-proxies/service-proxies';
import { AssessmentService } from '@app/admin/services/assessment.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-coordination',
  templateUrl: './coordination.component.html',
  styleUrls: ['./coordination.component.scss'],
  providers: [CalculationsServiceProxy, CoordinationServiceProxy]
})
export class CoordinationComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() fullName: string;
  @Input() clientId: string;
  isLoading = false;
  current_step = 1;
  position = 0;
  MAX_STEP = 4;
  types: number[] = [1, 0, 3, 2];
  result: AssessmentResult = new AssessmentResult();
  coordinationOptions: CoordinationOptionListDto[] = [];
  constructor(
    private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _assessmentService: AssessmentServiceProxy,
    private _coordinationService: CoordinationServiceProxy,
    private generalService: AssessmentService,
    private calculationService: CalculationsServiceProxy) {
    super(injector);
  }

  ngOnInit() {
  }
  open() {
    this.getCoordination();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  close() {
    this.activeModal.close();
  }
  getCoordination() {
    this.isLoading = true;
    this._coordinationService.getCoordination(this.clientId, this.position)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.coordinationOptions = result.items;
      });
  }
  getResult(seconds: number) {
    this.isLoading = true;
    this.calculationService.getCoordinationCompleteResults(seconds, this.types[this.current_step - 1])
      .pipe(finalize(() => {
        // this.getResult(this.coordinationOptions[0].numPieces);
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.result = result;
      });
  }
  next() {
    if (this.current_step !== this.MAX_STEP) {
      this.current_step++;
      this.getResult(this.coordinationOptions[this.current_step - 1].numPieces);
    }
  }
  prev() {
    if (this.current_step !== 1) {
      this.current_step--;
      this.getResult(this.coordinationOptions[this.current_step - 1].numPieces);
    }
  }
}
