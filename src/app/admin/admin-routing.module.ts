import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AttorneysComponent } from './lawfirms/attorneys/attorneys.component';
import { ClientsComponent } from './lawfirms/clients/clients.component';
import { ReportsComponent } from './reports/reports.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { JobDescriptionsComponent } from './job-descriptions/job-descriptions.component';
import { LawfirmsComponent } from './lawfirms/lawfirms/lawfirms.component';
import { NewAttorneyComponent } from './lawfirms/attorneys/new-attorney/new-attorney.component';
import { ViewAttorneyComponent } from './lawfirms/attorneys/view-attorney/view-attorney.component';
import { ViewLawfirmComponent } from './lawfirms/lawfirms/view-lawfirm/view-lawfirm.component';
import { ViewClientComponent } from './lawfirms/clients/view-client/view-client.component';

@NgModule({

    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: AdminComponent,
                children: [
                    { path: 'dashboard', component: DashboardComponent },
                    { path: 'lawfirms', component: LawfirmsComponent },
                    { path: 'job-descriptions', component: JobDescriptionsComponent },
                    { path: 'reports', component: ReportsComponent },
                    { path: 'activity-log', component: ActivityLogComponent },
                    { path: 'attorneys/list', component: AttorneysComponent },
                    { path: 'lawfirms/list', component: LawfirmsComponent },
                    { path: 'lawfirms/clients', component: ClientsComponent },
                    { path: 'attorneys/new', component: NewAttorneyComponent },
                    { path: 'lawfirms/view/:id', component: ViewLawfirmComponent },
                    { path: 'clients/view/:id', component: ViewClientComponent }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
