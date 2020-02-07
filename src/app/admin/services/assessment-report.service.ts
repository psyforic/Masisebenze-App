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

}
