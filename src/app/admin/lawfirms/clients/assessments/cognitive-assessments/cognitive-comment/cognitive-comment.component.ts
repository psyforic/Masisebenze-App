import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, Input, Injector, ViewChild, 
  ElementRef, TemplateRef, ViewContainerRef, AfterViewInit, OnDestroy, Optional, Inject } from '@angular/core';
import { ClientServiceProxy, AssessmentServiceProxy, AffectServiceProxy, CreateCommentInput,
   CommentServiceProxy } from '@shared/service-proxies/service-proxies';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditUserDialogComponent } from '@app/admin/users/edit-user/edit-user-dialog.component';

@Component({
  selector: 'app-cognitive-comment',
  templateUrl: './cognitive-comment.component.html',
  styleUrls: ['./cognitive-comment.component.scss'],
  providers: [CommentServiceProxy]
})
export class CognitiveCommentComponent extends AppComponentBase implements OnInit {
  @Input() fullName: string;
  @Input() clientId: string;
  @ViewChild('content', { static: false }) content: ElementRef;
  @ViewChild('content', { static: false }) _dialogTemplate: TemplateRef<any>;
  commentInput: CreateCommentInput = new CreateCommentInput();
  isLoading = false;
  private _overlayRef: OverlayRef;
  private _portal: TemplatePortal;
  constructor(
    private _dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private _data: any,
    private _clientService: ClientServiceProxy,
    private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _assessmentService: AssessmentServiceProxy,
    private _commentService: CommentServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    if(this._data != null){
      this.fullName = this._data.fullName;
      this.clientId = this._data.clientId;
    }
    this._commentService.getUserComments(this.clientId)
    .pipe(finalize(() =>{
      this.isLoading = false;
    })).subscribe(result => {
      this.commentInput = result;
    });
  }
  show(){
    this.isLoading = true;
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
    .result.then(() => { }, () => { });
   
  }
  save() {
    this.isLoading = true;
    if (this.commentInput.text != null || this.commentInput.text !== '' && this.clientId != null) {
      this.commentInput.targetId = this.clientId;
      this._commentService.createComment(this.commentInput)
        .pipe(finalize(() => {
          this.isLoading = false;
        }))
        .subscribe(() => {
          this.notify.success('Saved Successfully');
          this.close();
        });
    }
  }
  close() {
    this.modalService.dismissAll();
    this._dialogRef.close(true);
  }
}
