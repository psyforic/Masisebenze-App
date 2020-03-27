import { ReportSummaryServiceProxy, ReportSummaryDto } from '../../../../../../shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, ViewChild, ElementRef, Input, Injector } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['./report-summary.component.scss'],
  providers: [ReportSummaryServiceProxy]
})
export class ReportSummaryComponent extends AppComponentBase implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;
  @Input() fullName: string;
  @Input() clientId: string;
  isLoading = false;
  reportSumary: ReportSummaryDto = new ReportSummaryDto();
  constructor(
    injector: Injector,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _reportSummaryService: ReportSummaryServiceProxy) {
    super(injector);
  }
  ngOnInit() {
  }
  open() {
    this.getVisuoSpatialAbility();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  save() {
    this.isLoading = true;
    this.reportSumary.clientId = this.clientId;
    this._reportSummaryService.create(this.reportSumary).
    pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe(() => {
      this.notify.success('Saved successfully!');
    });
  }
  close() {
    this.activeModal.close();
  }
  getVisuoSpatialAbility() {
    this.isLoading = true;
    this._reportSummaryService.getByClientId(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe(result => {
        if (result != null) {
          this.reportSumary = result;
        }
      });
  }

}
