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
import { ViewLawfirmComponent } from './lawfirms/lawfirms/view-lawfirm/view-lawfirm.component';
import { ViewClientComponent } from './lawfirms/clients/view-client/view-client.component';
import { ViewActivityLogComponent } from './lawfirms/clients/view-activity-log/view-activity-log.component';
import { UsersComponent } from './users/users.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { UploadDocumentComponent } from './lawfirms/clients/upload-document/upload-document.component';
import { RolesComponent } from './roles/roles.component';

@NgModule({

    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: AdminComponent,
                children: [
                    { path: 'dashboard', component: DashboardComponent, canActivate: [AppRouteGuard] },
                    { path: 'users', component: UsersComponent },
                    { path: 'roles', component: RolesComponent },
                    { path: 'lawfirms', component: LawfirmsComponent, canActivate: [AppRouteGuard] },
                    { path: 'job-descriptions', component: JobDescriptionsComponent, canActivate: [AppRouteGuard] },
                    { path: 'reports', component: ReportsComponent, canActivate: [AppRouteGuard] },
                    { path: 'activity-log', component: ActivityLogComponent, canActivate: [AppRouteGuard] },
                    { path: 'attorneys/list', component: AttorneysComponent, canActivate: [AppRouteGuard] },
                    { path: 'lawfirms/list', component: LawfirmsComponent, canActivate: [AppRouteGuard] },
                    { path: 'clients', component: ClientsComponent, canActivate: [AppRouteGuard] },
                    { path: 'attorneys/new', component: NewAttorneyComponent, canActivate: [AppRouteGuard] },
                    { path: 'lawfirms/view/:id', component: ViewLawfirmComponent, canActivate: [AppRouteGuard] },
                    { path: 'clients/view/:id', component: ViewClientComponent, canActivate: [AppRouteGuard] },
                    { path: 'clients/documents/upload/:id', component: UploadDocumentComponent, canActivate: [AppRouteGuard] },
                    { path: 'clients/activity-log/:id', component: ViewActivityLogComponent, canActivate: [AppRouteGuard] }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
