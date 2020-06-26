import { AssessmentServiceProxy, AssessmentsListListDto, CreateCommentInput } from '@shared/service-proxies/service-proxies';

import {
  BalanceProtocolServiceProxy,
  BalanceProtocolOptionListDto,
  WalkingProtocolServiceProxy,
  WalkingProtocolDetailOutput,
  StairClimbingProtocolServiceProxy,
  LadderWorkProtocolServiceProxy,
  RepetitiveFootMotionProtocolServiceProxy,
  RepetitiveSquattingProtocolServiceProxy,
  CrawlingProtocolServiceProxy,
  CrawlingProtocolDetailOutput,
  RepetitiveFootMotionOptionDto,
  RepetitiveSquattingOptionDto,
  LadderWorkOptionDto,
  StairClimbingOptionDto,
  RepetitiveFootMotionProtocolDto,
  ClientAssessmentReportServiceProxy,
  RepetitiveToleranceDto,
  WorkAssessmentReportServiceProxy
} from './../../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, ViewChild, ElementRef, Injector, Input, AfterViewInit, ViewChildren } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { AssessmentService } from '@app/admin/services/assessment.service';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material';
import * as $ from 'jquery'
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
    CrawlingProtocolServiceProxy,
    WorkAssessmentReportServiceProxy,
  ]
})
export class RepetitiveToleranceProtocolComponent extends AppComponentBase implements OnInit, AfterViewInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() fullName: string;
  @Input() clientId: string;
  walking_current_step = 0;
  WALKING_MAX_STEP = 0;
  stair_current_step = 0;
  STAIR_MAX_STEP = 0;
  balance_current_step = 0;
  BALANCE_MAX_STEP = 3;
  ladder_current_step = 0;
  LADDER_MAX_STEP = 0;
  rs_current_step = 0;
  RS_MAX_STEP = 0;
  lrf_current_step = 0;
  rrf_current_step = 0;
  LRF_MAX_STEP = 0;
  RRF_MAX_STEP = 0;
  crawling_current_step = 0;
  CRAWLING_MAX_STEP = 0;
  isLoading = false;
  balanceProtocolOptions: BalanceProtocolOptionListDto[] = [];
  stairClimbingProtocolResult: StairClimbingOptionDto[] = [];
  repetitiveSquattingProtocolOptions: RepetitiveSquattingOptionDto[] = [];
  repetitiveLeftFootMotionProtocolOptions: RepetitiveFootMotionOptionDto[] = [];
  repetitiveFootMotion: RepetitiveFootMotionProtocolDto[] = [];
  repetitiveRightFootMotionProtocolOptions: RepetitiveFootMotionOptionDto[] = [];
  ladderWorkProtocolOptions: LadderWorkOptionDto[] = [];
  walkingProtocol: WalkingProtocolDetailOutput = new WalkingProtocolDetailOutput();
  crawlingProtocol: CrawlingProtocolDetailOutput = new CrawlingProtocolDetailOutput();
  repFootMotionOption: RepetitiveFootMotionOptionDto = new RepetitiveFootMotionOptionDto();
  crawlingProtocolResult: RepetitiveToleranceDto = new RepetitiveToleranceDto();
  stairClimbResult: RepetitiveToleranceDto = new RepetitiveToleranceDto();
  balanceProtocolResult: RepetitiveToleranceDto = new RepetitiveToleranceDto();
  walkingProtocolResult: RepetitiveToleranceDto = new RepetitiveToleranceDto();
  ladderWorkProtocolResult: RepetitiveToleranceDto = new RepetitiveToleranceDto();
  repetitiveSquattingProtocolResult: RepetitiveToleranceDto = new RepetitiveToleranceDto();
  repetitiveFootMotionProtocolResult: RepetitiveToleranceDto = new RepetitiveToleranceDto();
  selectedAssessments: AssessmentsListListDto[] = [];
  commentLabel = ' Show Comment';
  isCommentShown = false;
  commentInput: CreateCommentInput = new CreateCommentInput();
  constructor(
    private injector: Injector,
    private modalService: NgbModal,
    private assessService: AssessmentService,
    private _assessmentService: AssessmentServiceProxy,
    private _workAssessmentReportService: WorkAssessmentReportServiceProxy,
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
  ngAfterViewInit() {
  }
  open() {
    // this.getRepetitiveSquattingProtocol();
    // this.getBalanceProtocol();
    // this.getRepetitiveLeftFootMotionProtocol();

    this.getSelectedAssessments();
    // this.getStairClimbingProtocol();
    // this.getLadderWorkProtocol();
    // this.getCrawlingProtocol();
    this.modalService.open(this.content,
      { windowClass: 'slideInDown', backdrop: 'static', keyboard: false, size: 'xl' })
      .result.then(() => {
      }, () => { });
  }
  wNext() {
    if (this.walking_current_step !== this.WALKING_MAX_STEP) {
      this.walking_current_step++;
    }
  }
  wPrev() {
    if (this.walking_current_step !== 0) {
      this.walking_current_step--;
    }
  }
  lNext() {
    if (this.ladder_current_step !== this.LADDER_MAX_STEP) {
      this.ladder_current_step++;
    }
  }
  lPrev() {
    if (this.ladder_current_step !== 0) {
      this.ladder_current_step--;
    }
  }
  bNext() {
    if (this.balance_current_step !== this.BALANCE_MAX_STEP) {
      this.balance_current_step++;
    }
  }
  bPrev() {
    if (this.balance_current_step !== 0) {
      this.balance_current_step--;
    }
  }
  rsNext() {
    if (this.rs_current_step !== this.RS_MAX_STEP) {
      this.rs_current_step++;
    }
  }
  rsPrev() {
    if (this.rs_current_step !== 0) {
      this.rs_current_step--;
    }
  }
  lrfNext() {
    if (this.lrf_current_step !== this.LRF_MAX_STEP) {
      this.lrf_current_step++;
    }
  }
  rrfNext() {
    if (this.rrf_current_step !== this.RRF_MAX_STEP) {
      this.rrf_current_step++;
    }
  }
  lrfPrev() {
    if (this.lrf_current_step !== 0) {
      this.lrf_current_step--;
    }
  }
  rrfPrev() {
    if (this.rrf_current_step !== 0) {
      this.rrf_current_step--;
    }
  }
  sNext() {
    if (this.stair_current_step !== this.STAIR_MAX_STEP) {
      this.stair_current_step++;
    }
  }
  sPrev() {
    if (this.stair_current_step !== 0) {
      this.stair_current_step--;
    }
  }
  cNext() {
    if (this.crawling_current_step !== this.CRAWLING_MAX_STEP) {
      this.crawling_current_step++;
    }
  }
  cPrev() {
    if (this.crawling_current_step !== 0) {
      this.crawling_current_step--;
    }
  }
  close() {
    this.activeModal.close();
  }
  async getSelectedAssessments() {
    this.isLoading = true;
    this._assessmentService.getSelectedRepetitiveToleranceAssessments(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.selectedAssessments.forEach(item => {
          switch (item.identifier) {
            case 204:
              this.getWalkingProtocol();
              break;
            case 201:
              this.getStairClimbingProtocol();
              break;
            case 202:
              this.getCrawlingProtocol();
              break;
            case 203:
                this.getRepetitiveFootMotionProtocol();
              break;
            case 205:
              this.getBalanceProtocol();
              break;
            case 206:
              this.getLadderWorkProtocol();
              break;
            case 207:
              this.getRepetitiveSquattingProtocol();
              break;
          }
        });
      }))
      .subscribe(assessments => {
        this.selectedAssessments = assessments.items;
        this.getWalkingProtocol();
        // console.log(assessments);
      });
  }
  isAssessmentSelected(identifier: number) {
    return this.selectedAssessments.filter(x => x.identifier === identifier).length > 0;
  }
  getBalanceProtocol() {
    this.isLoading = true;
    this._balanceProtocolService.get(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((results) => {
        this.balanceProtocolOptions = (results != null) ? results.items.filter(x => x.status === 1) : this.balanceProtocolOptions;
        if (this.balanceProtocolOptions.length > 0) {
          // console.log(this.balanceProtocolOptions)
          this._workAssessmentReportService.getBalance(this.clientId).
            subscribe(result => {
              this.balanceProtocolResult = (result != null) ? result : this.balanceProtocolResult;
            });
        }
      });
  }
  getWalkingProtocol() {
    this.isLoading = true;
    this._walkingProtocolService.get(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        if (result != null) {
          this.walkingProtocol = result;
          this._workAssessmentReportService.getWalking(this.clientId)
            .subscribe(results => {
              this.walkingProtocolResult = (results != null) ? results : null;
            });
        }
      });
  }
  getStairClimbingProtocol() {
    this.isLoading = true;
    this._stairClimbingProtocolService.get(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        if (result != null) {
          this.STAIR_MAX_STEP = result.items.length - 1;
          this.stairClimbingProtocolResult = result.items;
          this.getStairClimbingProtocolResult();
        }

      });
  }
  getStairClimbingProtocolResult() {
    this._workAssessmentReportService.getStairClimb(this.clientId)
      .subscribe((result) => {
        this.stairClimbResult = (result != null) ? result : this.stairClimbResult;
      });
  }
  getLadderWorkProtocol() {
    this.isLoading = true;
    this._ladderWorkService.get(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((results) => {
        this.LADDER_MAX_STEP = (results != null) ? results.items.length - 1 : 0;
        this.ladderWorkProtocolOptions = (results != null) ? results.items : null;
        if (this.ladderWorkProtocolOptions.length > 0) {
          this._workAssessmentReportService.getLadderWork(this.clientId)
            .subscribe(result => {
              this.ladderWorkProtocolResult = result;
            });
        }
      });
  }
  getRepetitiveSquattingProtocol() {
    this.isLoading = true;
    this._repetitiveSquattingProtocolService.get(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.RS_MAX_STEP = (result != null) ? result.items.length - 1 : 0;
        this.repetitiveSquattingProtocolOptions = (result != null) ?
          result.items : this.repetitiveSquattingProtocolOptions;
        if (this.repetitiveSquattingProtocolOptions) {
          this._workAssessmentReportService.getRepetitiveSquatting(this.clientId)
            .subscribe(results => {
              this.repetitiveSquattingProtocolResult = (results != null) ? results : this.repetitiveSquattingProtocolResult;
            });
        }
      });
  }
  getRepetitiveLeftFootMotionProtocol() {
    this.isLoading = true;
    this._repetitiveFootMotionProtocolService.getBySide(this.clientId, 0)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.LRF_MAX_STEP = (result != null) ? result.items.length - 1 : 0;
        this.repetitiveLeftFootMotionProtocolOptions = (result != null) ?
          result.items : this.repetitiveLeftFootMotionProtocolOptions;

        // if (this.repetitiveFootMotion.length > 0) {
        //   this.repetitiveFootMotion.forEach((element, index) => {
        //     element.repetitiveFootMotionOptions.forEach((item, i) => {
        //       item.comment = index.toLocaleString() + ' ' + i.toString();
        //     });
        //   });
        // }

      });
  }
  getRepetitiveRightFootMotionProtocol() {
    this.isLoading = true;
    this._repetitiveFootMotionProtocolService.getBySide(this.clientId, 1)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.RRF_MAX_STEP = (result != null) ? result.items.length - 1 : 0;
        this.repetitiveRightFootMotionProtocolOptions = (result != null) ?
          result.items : this.repetitiveRightFootMotionProtocolOptions;
      });
  }
  getRepetitiveLeftFootMotionProtocolOptions(repetitiveFootMotionProtocolId, tabIndex): RepetitiveFootMotionOptionDto[] {
    if (this.repetitiveFootMotion.filter(x => x.id === repetitiveFootMotionProtocolId).length > 0) {
      const repM = this.repetitiveFootMotion.filter(x => x.id === repetitiveFootMotionProtocolId)[0];
      if (tabIndex === 0) {
        return repM.repetitiveFootMotionOptions.filter(x => x.side === 0);
      } else {
        return repM.repetitiveFootMotionOptions.filter(x => x.side === 1);
      }
    }
  }
  getRepetitiveFootMotionProtocol() {
    this.isLoading = true;
    this._workAssessmentReportService.getRepetitiveFootMotion(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.repetitiveFootMotionProtocolResult = result;
        this.getRepetitiveLeftFootMotionProtocol();
        this.getRepetitiveRightFootMotionProtocol();
      });
  }
  getCrawlingProtocol() {
    this.isLoading = true;
    this._crawlingProtocolService.get(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        // console.log(result);
        if (result != null && result.status === 1) {
          this.crawlingProtocol = result;
          this._workAssessmentReportService.getCrawling(this.clientId)
            .subscribe(results => {
              this.crawlingProtocolResult = (results != null) ? results : this.crawlingProtocolResult;
            });
        }
      });
  }
  decodeResult(index: number, result: number) {
    const options: string[] = this.assessService.getBorgBalanceOptions(index);
    return options[result];
  }
  decodePainLevel(painLevel: number) {
    return this.assessService.getPain(painLevel);
  }
  handleRepFootMotionTabs(event: MatTabChangeEvent, repetitiveFootMotionProtocolId) {
    console.log(event.index);
  }
  handleTabChange(event: MatTabChangeEvent) {
    switch (event.index) {
      case 0:
        this.getWalkingProtocol();
        break;
      case 1:
        this.getStairClimbingProtocol()
        break;
      case 2:
        this.getBalanceProtocol();
        this.getBalanceProtocol();
        break;
      case 3:
        this.getLadderWorkProtocol();
        break;
      case 4:
        this.getRepetitiveSquattingProtocol();
        break;
      case 5:
        this.getRepetitiveFootMotionProtocol();
        break;
      case 6:
        this.getCrawlingProtocol();
        break;
      default:
        break;
    }
  }
  showHideBalanceComment() {
    if (this.isCommentShown) {
      this.isCommentShown = false;
      this.commentLabel = 'Show Comment';
    } else {
      this.isCommentShown = true;
      this.commentLabel = 'Hide Comment';
    }
  }
  saveComment() {
    this.isLoading = true;
    if (this.commentInput.text != null || this.commentInput.text !== '') {
      this._balanceProtocolService.updateOTComment(this.clientId, this.commentInput.text)
        .pipe(finalize(() => {
          this.isLoading = false;
        }))
        .subscribe(() => {
          this.notify.success('Comment Saved Successfully');
        });
    }
  }
  getComments() {
    this.isLoading = true;
    this._balanceProtocolService.getOTComment(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.commentInput.text = result.otComment;
      });
  }

}
