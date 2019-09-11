import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { PartialsModule } from '../partials/partials.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NewBookingComponent } from './bookings/new-booking/new-booking.component';
import { BookingsComponent } from './bookings/bookings.component';
import { NewEventComponent } from './new-event/new-event.component';


@NgModule({
  declarations: [DashboardComponent, BookingsComponent, NewBookingComponent, NewEventComponent],
  imports: [
    CommonModule,
    PartialsModule,
    NgbModule,
    FullCalendarModule,
  ],
  entryComponents: [NewBookingComponent, NewEventComponent]
})
export class DashboardModule { }
