import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
