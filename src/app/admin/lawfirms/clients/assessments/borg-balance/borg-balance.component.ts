import { BorgBalanceServiceProxy, CreateCommentInput } from './../../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, ViewChild, ElementRef, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentServiceProxy, BorgBalanceOptionDto } from '@shared/service-proxies/service-proxies';
import { AssessmentService } from '@app/admin/services/assessment.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-borg-balance',
  templateUrl: './borg-balance.component.html',
  styleUrls: ['./borg-balance.component.scss'],
  providers: [BorgBalanceServiceProxy]
})
export class BorgBalanceComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() clientId: string;
  @Input() fullName: string;
  options: BorgBalanceOptionDto[] = [];
  current_step = 1;
  MAX_STEP = 14;
  isLoading = false;
  commentLabel ='Show Comment';
  isCommentShown = false;
  commentInput: CreateCommentInput = new CreateCommentInput();
  constructor(
    private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _assessmentService: AssessmentServiceProxy,
    private _borgBalanceService: BorgBalanceServiceProxy,
    private assessService: AssessmentService) {
    super(injector);
  }

  ngOnInit() {

  }
  open() {
    this.getOptions();
    this.getComments();
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
    this._borgBalanceService.getBorgBalance(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.options = result.items;
        console.log(this.options);
      });
  }
  decodeResult(index: number, result: number) {
    const options: string[] = this.assessService.getBorgBalanceOptions(index);
    return options[result];
  }
  decodePainLevel(painLevel: number) {
    return this.assessService.getPain(painLevel);
  }
  showHideComment() {
    if(this.isCommentShown){
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
      this._borgBalanceService.updateOTComment(this.clientId, this.commentInput.text)
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
    this._borgBalanceService.getOTComment(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.commentInput.text = result.otComment;
      });
  }
}
