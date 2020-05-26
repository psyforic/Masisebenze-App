import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, Injector } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent extends AppComponentBase implements OnInit {
  test: Date = new Date();
  versionText: string;
  constructor(injector: Injector) {
    super(injector);
    this.versionText = this.appSession.application.version + ' [' + this.appSession.application.releaseDate.format('DD-MM-YYYY') + ']';
  }

  ngOnInit() {
  }

}
