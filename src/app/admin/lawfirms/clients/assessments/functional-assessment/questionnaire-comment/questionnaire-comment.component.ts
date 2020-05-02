import { FunctionalAssessmentServiceProxy } from '@shared/service-proxies/service-proxies';
import {
  CommentServiceProxy, CreateCommentInput,
  QuestionnaireDto
} from './../../../../../../../shared/service-proxies/service-proxies';
import {
  Component,
  OnInit, Injector,
  ViewChild,
  Input,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
declare let $: any;
@Component({
  selector: 'app-questionnaire-comment',
  templateUrl: './questionnaire-comment.component.html',
  styleUrls: ['./questionnaire-comment.component.scss'],
  providers: [CommentServiceProxy, FunctionalAssessmentServiceProxy]
})
export class QuestionnaireCommentComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild('quill', { static: true }) quillEditor: ElementRef;
  @Input() fullName: string;
  @Input() clientId: string;
  @Input() type: number;
  @Input() description: string;
  commentInput: CreateCommentInput = new CreateCommentInput();
  questionnaire: QuestionnaireDto = new QuestionnaireDto();
  isLoading = false;
  saving = false;
  constructor(
    injector: Injector,
    private _functionalAssessmentService: FunctionalAssessmentServiceProxy,
    private _commentService: CommentServiceProxy
  ) {
    super(injector);
  }
  ngAfterViewInit(): void {
    $(document).ready(function () {
      $('#quill').focus();
    });

  }
  ngOnInit() {
    this.getQuestionnaire();
  }
  getQuestionnaire() {
    this._functionalAssessmentService.getQuestionnaire(this.type, this.clientId)
      .subscribe((result) => {
        this.questionnaire = result;
        this.getComments();
      });
  }
  save() {
    this.isLoading = true;
    if (this.commentInput.text != null || this.commentInput.text !== '') {
      this.commentInput.targetId = this.questionnaire.id;
      this._commentService.createComment(this.commentInput)
        .pipe(finalize(() => {
          this.isLoading = false;
        }))
        .subscribe(() => {
          this.notify.success('Saved Successfully');
        });
    }
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
}
