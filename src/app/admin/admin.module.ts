import { PostureServiceProxy, GripStrengthServiceProxy, SensationServiceProxy,
  BorgBalanceServiceProxy, GaitServiceProxy, MusclePowerServiceProxy,
   CoordinationServiceProxy } from './../../shared/service-proxies/service-proxies';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from '@app/layout/footer/footer.component';
import { NavbarComponent } from '@app/layout/navbar/navbar.component';
import { SidebarComponent } from '@app/layout/sidebar/sidebar.component';
import { JobDescriptionsModule } from './job-descriptions/job-descriptions.module';
import { ReportsModule } from './reports/reports.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { LawfirmsModule } from './lawfirms/lawfirms.module';
import { PartialsModule } from './partials/partials.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ClientServiceProxy, AssessmentServiceProxy, FunctionalAssessmentServiceProxy } from '@shared/service-proxies/service-proxies';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  imports: [
    AdminRoutingModule,
    CommonModule,
    LawfirmsModule,
    JobDescriptionsModule,
    ReportsModule,
    ActivityLogModule,
    PartialsModule,
    DashboardModule,
    UsersModule,
    RolesModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    AdminComponent],
  providers: [ClientServiceProxy, AssessmentServiceProxy, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class AdminModule { }
