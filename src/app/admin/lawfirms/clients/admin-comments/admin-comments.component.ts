import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ClientServiceProxy,
  CommentServiceProxy,
  ClientDetailOutput,
  CreateCommentInput
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
  isLoading = false;
  client: ClientDetailOutput = new ClientDetailOutput();
  commentInput: CreateCommentInput = new CreateCommentInput();
  constructor(
    injector: Injector,
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
    this.isLoading = true;
    this.commentService.getUserComments(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.commentInput = result;
      });
  }
  save() {
    this.isLoading = true;
    this.commentInput.targetId = this.clientId;
    this.commentService.createComment(this.commentInput)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(() => {
        this.notify.success('Saved Successfully');
      });
  }

}
