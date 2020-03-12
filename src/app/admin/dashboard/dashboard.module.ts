import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { PartialsModule } from '../partials/partials.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NewEventComponent } from './new-event/new-event.component';
import { ClientBottomSheetComponent } from './client-bottom-sheet/client-bottom-sheet.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { FormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  declarations: [DashboardComponent, ClientBottomSheetComponent, EditEventComponent, NewEventComponent],
  imports: [
    CommonModule,
    PartialsModule,
    FormsModule,
    NgbModule,
    FullCalendarModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  entryComponents: [NewEventComponent, ClientBottomSheetComponent, EditEventComponent]
})
export class DashboardModule { }
