import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingServiceProxy, ClientServiceProxy, CommentServiceProxy, ClientDetailOutput } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-admin-comments',
  templateUrl: './admin-comments.component.html',
  styleUrls: ['./admin-comments.component.scss'],
  providers: [ClientServiceProxy, CommentServiceProxy]
})
export class AdminCommentsComponent extends AppComponentBase implements OnInit {

  clientId: string;
  client: ClientDetailOutput = new ClientDetailOutput();
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
  }
  getClient() {
    this.clientService.getDetail(this.clientId)
      .subscribe((result) => {
        this.client = result;
      });
  }

}
