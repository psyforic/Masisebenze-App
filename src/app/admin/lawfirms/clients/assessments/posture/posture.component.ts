import { PostureServiceProxy, CreateCommentInput, CommentServiceProxy } from './../../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, ViewChild, ElementRef, Injector, Input } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PostureOptionDto, AssessmentServiceProxy } from '@shared/service-proxies/service-proxies';
import { AssessmentService } from '@app/admin/services/assessment.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-posture',
  templateUrl: './posture.component.html',
  styleUrls: ['./posture.component.scss'],
  providers: [PostureServiceProxy, CommentServiceProxy]
})
export class PostureComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() fullName: string;
  @Input() clientId: string;
  assessmentId: string;
  current_step = 1;
  MAX_STEP = 13;
  isLoading = false;
  srcImage = '';
  commentLabel ='Show Comment';
  isCommentShown = false;
  postureOptions: PostureOptionDto[] = [];
  commentInput: CreateCommentInput = new CreateCommentInput();
  constructor(
    private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _assessmentService: AssessmentServiceProxy,
    private _commentService: CommentServiceProxy,
    private _postureService: PostureServiceProxy,
    private _generalService: AssessmentService) {
    super(injector);
  }

  ngOnInit() {
  }
  open(assessmentId) {
   this.assessmentId = assessmentId;
    this.getPostureOptions();
    this.getComments();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  close() {
    this.activeModal.close();
  }
  getPostureOptions() {
    this.isLoading = true;
    this._postureService.getPosture(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.showImage(this.postureOptions[0].postureOptionScore);
      }))
      .subscribe((result) => {
        this.postureOptions = result.items;
      });
  }
  next() {
    if (this.current_step !== this.MAX_STEP) {
      this.current_step++;
      this.showImage(this.postureOptions[this.current_step - 1].postureOptionScore);
    }
  }
  prev() {
    if (this.current_step !== 1) {
      this.current_step--;
      this.showImage(this.postureOptions[this.current_step - 1].postureOptionScore);
    }
  }
  decodePain(option: number) {
    return this._generalService.getPain(option);
  }
  showImage(score: number) {
    score = this._generalService.getPostureOptionScore(this.current_step - 1, score);
    if (score != null || undefined) {
      this.srcImage = `/assets/img/posture/${this.current_step}/${score + '.png'}`;
    }
  }
  getScore(score: number) {
    if (score != null || undefined) {
      return this._generalService.getPostureOptionScore(this.current_step - 1, score);
    }
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
      this._postureService.updateOTComment(this.clientId, this.commentInput.text)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(() => {
        this.notify.success('Comment Saved Successfully');
      });
      // this._commentService.createComment(this.commentInput)
      //   .pipe(finalize(() => {
      //     this.isLoading = false;
      //   }))
      //   .subscribe(() => {
      //     this.notify.success('Comment Saved Successfully');
      //   });
    }
  }
  getComments() {
    this.isLoading = true;
    this._postureService.getOTComment(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.commentInput.text = result.otComment;
      });
  }
}
