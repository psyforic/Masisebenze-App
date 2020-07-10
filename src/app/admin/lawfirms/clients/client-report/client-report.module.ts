import { PartialsModule } from '@app/admin/partials/partials.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientReportComponent } from './client-report.component';
import { ClientReportRoutingModule } from './client-report-routing.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    PartialsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ClientReportComponent
      }
    ]),
  ],
  declarations: [ClientReportComponent]
})
export class ClientReportModule { }
