import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ClientServiceProxy,
  CommentServiceProxy,
  ClientDetailOutput,
  CreateCommentInput,
  CommentDetailOutput
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-comments',
  templateUrl: './admin-comments.component.html',
  styleUrls: ['./admin-comments.component.scss'],
  providers: [ClientServiceProxy, CommentServiceProxy]
})
export class AdminCommentsComponent extends AppComponentBase implements OnInit {

  clientId: string;
  isSaving = false;
  editing = true;
  client: ClientDetailOutput = new ClientDetailOutput();
  commentInput: CreateCommentInput = new CreateCommentInput();
  commentEdit: CommentDetailOutput = new CommentDetailOutput();
  constructor(
    private injector: Injector,
    private route: ActivatedRoute,
    private commentService: CommentServiceProxy,
    private clientService: ClientServiceProxy) {
    super(injector);
    this.route.paramMap.subscribe((paramMap) => {
      this.clientId = paramMap.get('id');
    });
  }
  ngOnInit() {
    this.getClient();
    this.getComments();
  }
  getClient() {
    this.clientService.getDetail(this.clientId)
      .subscribe((result) => {
        this.client = result;
      });
  }
  getComments() {
    this.commentService.getUserComments(this.client.id)
      .subscribe((result) => {
        this.commentEdit = result;
        this.editing = result.text === 'undefined' ? false : true;
      });
  }
  save() {
    console.log('clicked');
    this.isSaving = true;
    this.commentInput.targetId = this.clientId;
    this.commentInput.text = this.commentEdit.text;
    console.log(this.commentEdit.text);
    this.commentService.createComment(this.commentInput)
      .pipe(finalize(() => {
        this.isSaving = false;
        this.getClient();
      }))
      .subscribe((result) => {
        this.notify.success('Saved Successfully');
      });
  }

  edit() {
    this.isSaving = true;
    this.commentService.editComment(this.commentEdit)
      .pipe(finalize(() => {
        this.isSaving = false;
        this.getClient();
      }))
      .subscribe((result) => {
        this.notify.success('Saved Successfully');
      });
  }

}
