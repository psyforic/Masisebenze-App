import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, Input, Injector, ViewChild, ElementRef } from '@angular/core';
import { ClientServiceProxy, AssessmentServiceProxy, AffectServiceProxy, CreateCommentInput,
   CommentServiceProxy } from '@shared/service-proxies/service-proxies';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';

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
  commentInput: CreateCommentInput = new CreateCommentInput();
  isLoading = false;
  constructor(
    private _clientService: ClientServiceProxy,
    private injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _assessmentService: AssessmentServiceProxy,
    private _commentService: CommentServiceProxy) {
    super(injector);
  }


  ngOnInit() {
  }
  show(){
    this.isLoading = true;
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
    .result.then(() => { }, () => { });
    this._commentService.getUserComments(this.clientId)
    .pipe(finalize(()=>{
      this.isLoading = false;
    })).subscribe(result => {
      console.log(result);
      this.commentInput = result;
    });
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
  }
}
