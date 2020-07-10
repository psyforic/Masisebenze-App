import { ClientReportComponent } from './client-report.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';


export const routes: Routes = [
    {
        path: '',
        component: ClientReportComponent
    }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class ClientReportRoutingModule { }
