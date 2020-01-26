import { Injectable } from '@angular/core';
import { ReportServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssessmentReportService {

  constructor(private _reportService: ReportServiceProxy) {

  }

  getGripStrengthReport(clientId: string): Observable<any> {
    return this._reportService.getGripStrengthReport(clientId);
  }
  getShoulderReport(clientId: string): string {
    let report: string;
    this._reportService.getRoMShoulderReport(clientId)
      .pipe(finalize(() => {
        return report;
      }))
      .subscribe((result) => {
        report = result;
      });
    return report;
  }

}
