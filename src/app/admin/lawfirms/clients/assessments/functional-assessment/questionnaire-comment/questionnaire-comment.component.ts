import { FormControl } from '@angular/forms';
import { FunctionalAssessmentServiceProxy } from '@shared/service-proxies/service-proxies';
import {
  CommentListDto, CommentServiceProxy, CreateCommentInput,
  QuestionnaireDto
} from './../../../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, Injector, ViewChild, Input, ElementRef, AfterViewInit, Optional, Inject } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
// import * as $ from 'jquery';
import { from } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditorChangeHandler } from 'quill';
import { QuillEditorComponent } from 'ngx-quill';
declare let $: any;
@Component({
  selector: 'app-questionnaire-comment',
  templateUrl: './questionnaire-comment.component.html',
  styleUrls: ['./questionnaire-comment.component.scss'],
  providers: [CommentServiceProxy, FunctionalAssessmentServiceProxy]
})
export class QuestionnaireCommentComponent extends AppComponentBase implements OnInit, AfterViewInit {
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
    @Optional() public dialogRef: MatDialogRef<QuestionnaireCommentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private _functionalAssessmentService: FunctionalAssessmentServiceProxy,
    private _commentService: CommentServiceProxy
  ) {
    super(injector);
  }
  ngAfterViewInit(): void {
    
  }
  ngOnInit() {
    if(this.data != null) {
      this.fullName = this.data[0];
      this.clientId = this.data[1];
      this.type = this.data[2];
      this.description = this.data[3];
      this.getQuestionnaire();
    }
  }
  
  open(type: number) {
    this.type = type;
    this.getQuestionnaire();
    this.modalService.open(this.content, { windowClass: 'modal-height', backdrop: 'static', keyboard: false, size: 'sm' })
      .result.then(() => { }, () => { });
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
    this.dialogRef.close();
  }
  
}
