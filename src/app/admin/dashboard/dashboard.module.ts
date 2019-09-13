import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { PartialsModule } from '../partials/partials.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NewEventComponent } from './new-event/new-event.component';


@NgModule({
  declarations: [DashboardComponent, NewEventComponent],
  imports: [
    CommonModule,
    PartialsModule,
    NgbModule,
    FullCalendarModule,
  ],
  entryComponents: [ NewEventComponent]
})
export class DashboardModule { }
