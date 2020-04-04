
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
  RepetitiveFootMotionOption
} from './../../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, ViewChild, ElementRef, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { AssessmentService } from '@app/admin/services/assessment.service';
import { MatTabChangeEvent } from '@angular/material';

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
  stairClimbingProtocolResult: StairClimbingOptionDto[] = [];
  repetitiveSquattingProtocolResult: RepetitiveSquattingOptionDto[] = [];
  repetitiveLeftFootMotionProtocolResult: RepetitiveFootMotionOptionDto[] = [];
  repetitiveFootMotion: RepetitiveFootMotionProtocolDto[] = [];
  repetitiveRightFootMotionProtocolResult: RepetitiveFootMotionOptionDto[] = [];
  ladderWorkProtocolResult: LadderWorkOptionDto[] = [];
  walkingProtocol: WalkingProtocolDetailOutput = new WalkingProtocolDetailOutput();
  crawlingProtocolResult: CrawlingProtocolDetailOutput = new CrawlingProtocolDetailOutput();
  repFootMotionOption: RepetitiveFootMotionOption = new RepetitiveFootMotionOption();
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
    // this.getRepetitiveSquattingProtocol();
    // this.getBalanceProtocol();
    this.getWalkingProtocol();
    this.getRepetitiveLeftFootMotionProtocol();
    // this.getStairClimbingProtocol();
    // this.getLadderWorkProtocol();
    // this.getCrawlingProtocol();
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

        this.balanceProtocolResult = (result != null) ? result.items : null;

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
        this.stairClimbingProtocolResult = (result != null) ? result.items : this.stairClimbingProtocolResult;
      });
  }
  getLadderWorkProtocol() {
    this.isLoading = true;
    this._ladderWorkService.get(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.ladderWorkProtocolResult = (result != null) ? result.items : this.ladderWorkProtocolResult;
      });
  }
  getRepetitiveSquattingProtocol() {
    this.isLoading = true;
    this._repetitiveSquattingProtocolService.get(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.repetitiveSquattingProtocolResult = (result != null) ? result.items : this.repetitiveSquattingProtocolResult;
      });
  }
  getRepetitiveLeftFootMotionProtocol() {
    this.isLoading = true;
    this._repetitiveFootMotionProtocolService.get(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        console.log(result);

        this.repetitiveFootMotion = (result != null) ? result.items : this.repetitiveFootMotion;
        
      });
  }
  getRepetitiveLeftFootMotionProtocolOptions(repetitiveFootMotionProtocolId): RepetitiveFootMotionOption[] {
    if (this.repetitiveFootMotion.filter(x => x.id === repetitiveFootMotionProtocolId).length > 0) {
      const repM = this.repetitiveFootMotion.filter(x => x.id === repetitiveFootMotionProtocolId)[0];
      return repM.repetitiveFootMotionOptions;
    }
  }
  // getRepetitiveRightFootMotionProtocol(id: string, side: number) {
  //   this.isLoading = true;
  //   this._repetitiveFootMotionProtocolService.getById(id, side)
  //     .pipe(finalize(() => {
  //       this.isLoading = false;
  //     }))
  //     .subscribe((result) => {
  //       this.repetitiveRightFootMotionProtocolResult = result;
  //     });
  // }
  getCrawlingProtocol() {
    this.isLoading = true;
    this._crawlingProtocolService.get(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.crawlingProtocolResult = result;
      });
  }
  decodeResult(index: number, result: number) {
    const options: string[] = this.assessService.getBorgBalanceOptions(index);
    return options[result];
  }
  decodePainLevel(painLevel: number) {
    return this.assessService.getPain(painLevel);
  }
  handleRepFootMotionTabs(event: MatTabChangeEvent, repetitiveFootMotionProtocolId){
    switch (event.index) {
      case 0:
        if (this.repetitiveFootMotion.filter(x => x.id === repetitiveFootMotionProtocolId).length > 0) {
          const repM = this.repetitiveFootMotion.filter(x => x.id === repetitiveFootMotionProtocolId)[0];
          this.repFootMotionOption =  repM.repetitiveFootMotionOptions.filter(x => x.side === 0)[0];
        }
        break;
      case 1:
        if (this.repetitiveFootMotion.filter(x => x.id === repetitiveFootMotionProtocolId).length > 0) {
          const repM = this.repetitiveFootMotion.filter(x => x.id === repetitiveFootMotionProtocolId)[0];
          this.repFootMotionOption =  repM.repetitiveFootMotionOptions.filter(x => x.side === 1)[0];
        }
        break;
    }
  }
  handleTabChange(event: MatTabChangeEvent) {
    switch (event.index) {
      case 0:
        this.getWalkingProtocol();
        break;
      case 1:
        this.getStairClimbingProtocol();
        break;
      case 2:
        this.getBalanceProtocol();
        break;
      case 3:
        this.getLadderWorkProtocol();
        break;
      case 4:
        this.getRepetitiveSquattingProtocol();
        break;
      case 5:
        this.getCrawlingProtocol();
        break;
      case 6:
        this.getCrawlingProtocol();
        break;
      default:
        break;
    }
  }

}
