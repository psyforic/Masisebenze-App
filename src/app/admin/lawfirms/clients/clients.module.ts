import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import { ViewClientComponent } from './view-client/view-client.component';
import { NewClientComponent } from './new-client/new-client.component';
import { PartialsModule } from '@app/admin/partials/partials.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ViewActivityLogComponent } from './view-activity-log/view-activity-log.component';
import { VerticalTimelineModule } from 'angular-vertical-timeline';

@NgModule({
  declarations: [
    ClientsComponent,
    EditClientComponent,
    NewClientComponent,
    ViewClientComponent,
    ViewActivityLogComponent
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    PartialsModule,
    BsDatepickerModule.forRoot(),
    VerticalTimelineModule
  ],
  entryComponents: [NewClientComponent]
})
export class ClientsModule { }
