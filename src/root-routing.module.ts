import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [

    { path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },
    { path: 'admin', redirectTo: '/admin/dashboard', pathMatch: 'full' },
    {
        path: 'account',
        loadChildren: () => import('account/account.module').then(m => m.AccountModule), // Lazy load account module
        data: { preload: true }
    },
    {
        path: 'app',
        loadChildren: () => import('app/app.module').then(m => m.AppModule), // Lazy load account module
        data: { preload: true }
    }
    , {
        path: 'admin',
        loadChildren: 'app/admin/admin.module#AdminModule', // Lazy load client-user module
        data: { preload: true }
    },
    {
        path: 'documents/upload',
        loadChildren: 'app/admin/documents/documents.module#DocumentsModule'
    },
    {
        path: 'client-report',
        loadChildren: 'app/admin/lawfirms/clients/client-report/client-report.module#ClientReportModule'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class RootRoutingModule { }
