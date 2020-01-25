
import {
  BalanceProtocolServiceProxy,
  BalanceProtocolOptionListDto,
  WalkingProtocolServiceProxy,
  WalkingProtocolDetailOutput,
  StairClimbingProtocolServiceProxy,
  StairClimbingProtocolDetailOutput,
  LadderWorkProtocolServiceProxy,
  LadderWorkProtocolDetailOutput,
  RepetitiveFootMotionProtocolServiceProxy,
  RepetitiveSquattingProtocolServiceProxy,
  RepetitiveSquattingProtocolDetailOutput,
  RepetitiveFootMotionProtocolDetailOutput,
  CrawlingProtocolServiceProxy,
  CrawlingProtocolDetailOutput
} from './../../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, ViewChild, ElementRef, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { AssessmentService } from '@app/admin/services/assessment.service';

@Component({
  selector: 'app-repetitive-tolerance-protocol',
  templateUrl: './repetitive-tolerance-protocol.component.html',
  styleUrls: ['./repetitive-tolerance-protocol.component.scss'],
  providers: [
    BalanceProtocolServiceProxy,
    WalkingProtocolServiceProxy,
    StairClimbingProtocolServiceProxy,
    LadderWorkProtocolServiceProxy,
    RepetitiveSquattingProtocolServiceProxy,
    RepetitiveFootMotionProtocolServiceProxy,
    CrawlingProtocolServiceProxy
  ]
})
export class RepetitiveToleranceProtocolComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() fullName: string;
  @Input() clientId: string;
  current_step = 1;
  MAX_STEP = 4;
  isLoading = false;
  balanceProtocolResult: BalanceProtocolOptionListDto[] = [];
  stairClimbingProtocolResult: StairClimbingProtocolDetailOutput[] = [];
  repetitiveSquattingProtocolResult: RepetitiveSquattingProtocolDetailOutput[] = [];
  repetitiveLeftFootMotionProtocolResult: RepetitiveFootMotionProtocolDetailOutput[] = [];
  repetitiveRightFootMotionProtocolResult: RepetitiveFootMotionProtocolDetailOutput[] = [];
  ladderWorkProtocolResult: LadderWorkProtocolDetailOutput[] = [];
  walkingProtocol: WalkingProtocolDetailOutput = new WalkingProtocolDetailOutput();
  crawlingProtocolResult: CrawlingProtocolDetailOutput[] = [];
  constructor(
    private injector: Injector,
    private modalService: NgbModal,
    private assessService: AssessmentService,
    private _ladderWorkService: LadderWorkProtocolServiceProxy,
    private _balanceProtocolService: BalanceProtocolServiceProxy,
    private _walkingProtocolService: WalkingProtocolServiceProxy,
    private _repetitiveSquattingProtocolService: RepetitiveSquattingProtocolServiceProxy,
    private _repetitiveFootMotionProtocolService: RepetitiveFootMotionProtocolServiceProxy,
    private _crawlingProtocolService: CrawlingProtocolServiceProxy,
    private _stairClimbingProtocolService: StairClimbingProtocolServiceProxy,
    private activeModal: NgbActiveModal) {
    super(injector);
  }

  ngOnInit() {
  }
  open() {
    this.getRepetitiveSquattingProtocol();
    this.getBalanceProtocol();
    this.getWalkingProtocol();
    this.getStairClimbingProtocol();
    this.getLadderWorkProtocol();
    this.getRepetitiveLeftFootMotionProtocol();
    this.getRepetitiveRightFootMotionProtocol();
    this.getCrawlingProtocol();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false, size: 'xl' })
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
  getBalanceProtocol() {
    this.isLoading = true;
    this._balanceProtocolService.get(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.balanceProtocolResult = result.items;
      });
  }
  getWalkingProtocol() {
    this.isLoading = true;
    this._walkingProtocolService.get(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {

        this.walkingProtocol = result;
      });
  }
  getStairClimbingProtocol() {
    this.isLoading = true;
    this._stairClimbingProtocolService.get(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.stairClimbingProtocolResult = result.items;
      });
  }
  getLadderWorkProtocol() {
    this.isLoading = true;
    this._ladderWorkService.get(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.ladderWorkProtocolResult = result.items;
      });
  }
  getRepetitiveSquattingProtocol() {
    this.isLoading = true;
    this._repetitiveSquattingProtocolService.get(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.repetitiveSquattingProtocolResult = result.items;
      });
  }
  getRepetitiveLeftFootMotionProtocol() {
    this.isLoading = true;
    this._repetitiveFootMotionProtocolService.get(this.clientId, 0)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.repetitiveLeftFootMotionProtocolResult = result.items;
      });
  }
  getRepetitiveRightFootMotionProtocol() {
    this.isLoading = true;
    this._repetitiveFootMotionProtocolService.get(this.clientId, 1)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.repetitiveRightFootMotionProtocolResult = result.items;
      });
  }
  getCrawlingProtocol() {
    this.isLoading = true;
    this._crawlingProtocolService.get(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.crawlingProtocolResult = result.items;
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
