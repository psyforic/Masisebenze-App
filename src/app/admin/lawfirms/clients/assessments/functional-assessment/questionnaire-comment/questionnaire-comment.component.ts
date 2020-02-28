import { FunctionalAssessmentServiceProxy } from '@shared/service-proxies/service-proxies';
import { CommentListDto, CommentServiceProxy, CreateCommentInput,
  QuestionnaireDto } from './../../../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, Injector, ViewChild, Input, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-questionnaire-comment',
  templateUrl: './questionnaire-comment.component.html',
  styleUrls: ['./questionnaire-comment.component.scss'],
  providers: [CommentServiceProxy]
})
export class QuestionnaireCommentComponent extends AppComponentBase implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() fullName: string;
  @Input() clientId: string;
  @Input() type: number;
  @Input() description: string;
  commentInput: CreateCommentInput = new CreateCommentInput();
  questionnaire: QuestionnaireDto = new QuestionnaireDto();
  isLoading = false;
  saving = false;
  constructor(
    private injector: Injector,
    private modalService: NgbModal,
    private _functionalAssessmentService: FunctionalAssessmentServiceProxy,
    private _commentService: CommentServiceProxy
  ) {
    super(injector);
  }

  ngOnInit() {
  }
  open(type: number) {
    this.type = type;
    this.getQuestionnaire();

    this.modalService.open(this.content, { windowClass: 'modal-height', backdrop: 'static', keyboard: false, size: 'sm' })
      .result.then(() => { }, () => { });
  }
  async getQuestionnaire() {
    await this._functionalAssessmentService.getQuestionnaire(this.type, this.clientId)
      .subscribe((result) => {
        this.questionnaire = result;
        this.getComments();
      });
  }
  save() {
    this.isLoading = true;
    this.commentInput.targetId = this.questionnaire.id;
    this._commentService.createComment(this.commentInput)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(() => {
        this.notify.success('Saved Successfully');
      });
  }
  getComments() {
    this.isLoading = true;
    this._commentService.getUserComments(this.questionnaire.id)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.commentInput = result;
      });
  }
  close() {
    this.modalService.dismissAll();
  }
}
