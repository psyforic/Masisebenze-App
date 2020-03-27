import { finalize } from 'rxjs/operators';
import { WorkAssessmentReportServiceProxy, ClientDetailOutput } from './../../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-work-assessment',
  templateUrl: './work-assessment.component.html',
  styleUrls: ['./work-assessment.component.scss'],
  providers: [WorkAssessmentReportServiceProxy]
})
export class WorkAssessmentComponent extends AppComponentBase implements OnInit {
  client: ClientDetailOutput = new ClientDetailOutput();
  clientId = '';
  constructor(injector: Injector,
    private _workAssessmentReportService: WorkAssessmentReportServiceProxy) {
    super(injector);
   }

  ngOnInit() {
    this._workAssessmentReportService.getCrouching(this.clientId)
    .pipe(finalize(() => {

    })).subscribe(result => {

    });
  }

}
