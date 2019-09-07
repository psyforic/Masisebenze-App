import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttorneysComponent } from './attorneys.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

// Material

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PartialsModule } from '../../partials/partials.module';
import { NewAttorneyComponent } from './new-attorney/new-attorney.component';
import { EditAttorneyComponent } from './edit-attorney/edit-attorney.component';
import { NewContactComponent } from '../lawfirms/new-contact/new-contact.component';
import { ViewAttorneyComponent } from './view-attorney/view-attorney.component';
import { NewClientComponent } from '../lawfirms/new-client/new-client.component';

@NgModule({
    declarations: [
        AttorneysComponent,
        EditAttorneyComponent,
        ViewAttorneyComponent,
        NewAttorneyComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        PartialsModule,
        RouterModule.forChild([
            {
                path: '',
                component: AttorneysComponent
            },
            {
                path: 'new',
                component: NewAttorneyComponent
            },
            {
                path: 'view/:id',
                component: ViewAttorneyComponent
            },
        ]),
        FormsModule,
        ReactiveFormsModule,
        PartialsModule
    ],
    entryComponents: [NewAttorneyComponent],
    exports: [ViewAttorneyComponent, EditAttorneyComponent]
})
export class AttorneysModule { }
