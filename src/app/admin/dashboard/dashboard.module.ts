import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { PartialsModule } from '../partials/partials.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NewBookingComponent } from './bookings/new-booking/new-booking.component';


@NgModule({
  declarations: [DashboardComponent, NewBookingComponent],
  imports: [
    CommonModule,
    PartialsModule,
    NgbModule,
    FullCalendarModule,
  ]
})
export class DashboardModule { }
