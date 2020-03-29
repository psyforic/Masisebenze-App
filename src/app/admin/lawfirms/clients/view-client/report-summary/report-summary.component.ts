import {
  ReportSummaryServiceProxy, ReportSummaryDto, ClientServiceProxy,
  ClientDetailOutput
} from '../../../../../../shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, ViewChild, ElementRef, Input, Injector } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['./report-summary.component.scss'],
  providers: [ReportSummaryServiceProxy, ClientServiceProxy]
})
export class ReportSummaryComponent extends AppComponentBase implements OnInit {
  client: ClientDetailOutput = new ClientDetailOutput();

  clientId: string;
  isLoading = false;
  reportSummary: ReportSummaryDto = new ReportSummaryDto();
  constructor(
    injector: Injector,
    private _clientService: ClientServiceProxy,
    private route: ActivatedRoute,
    private _reportSummaryService: ReportSummaryServiceProxy,
    private _location: Location) {
    super(injector);
    this.route.paramMap.subscribe((paramMap) => {
      this.clientId = paramMap.get('id');
    });
  }
  ngOnInit() {
    this.getClient();
    this.getReportSummary();
  }
  backClicked() {
    this._location.back();
  }
  getClient() {
    this.isLoading = true;
    this._clientService.getDetail(this.clientId)
      .pipe((finalize(() => {
        this.isLoading = false;
      })))
      .subscribe((result) => {
        this.client = result;
      });
  }
  save() {
    this.isLoading = true;
    this.reportSummary.clientId = this.clientId;

    this._reportSummaryService.create(this.reportSummary).
      pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe(() => {
        this.notify.success('Saved successfully!');
      });
  }

  getReportSummary() {
    this.isLoading = true;
    this._reportSummaryService.getByClientId(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe(result => {
        if (result != null) {
          this.reportSummary = result;
        }
      });
  }

}
