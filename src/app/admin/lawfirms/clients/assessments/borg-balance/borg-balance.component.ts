import { Component, OnInit, ViewChild, ElementRef, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentServiceProxy, BorgBalanceOptionDto } from '@shared/service-proxies/service-proxies';
import { AssessmentService } from '@app/admin/services/assessment.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-borg-balance',
  templateUrl: './borg-balance.component.html',
  styleUrls: ['./borg-balance.component.scss']
})
export class BorgBalanceComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() clientId: string;
  @Input() fullName: string;
  options: BorgBalanceOptionDto[] = [];
  current_step = 1;
  MAX_STEP = 14;
  isLoading = false;

  constructor(
    private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _assessmentService: AssessmentServiceProxy,
    private assessService: AssessmentService) {
    super(injector);
  }

  ngOnInit() {

  }
  open() {
    this.getOptions();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  next() {
    if (this.current_step !== this.MAX_STEP) {
      this.current_step++;
    }
  }
  prev() {
    if (this.current_step !== 1) {
      this.current_step--;
    }
  }
  close() {
    this.activeModal.close();
  }
  getOptions() {
    this.isLoading = true;
    this._assessmentService.getBorgBalance(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.options = result.items;
      });
  }
  decodeResult(index: number, result: number) {
    const options: string[] = this.assessService.getBorgBalanceOptions(index);
    return options[result];
  }
  decodePainLevel(painLevel: number) {
    return this.assessService.getPain(painLevel);
  }
}