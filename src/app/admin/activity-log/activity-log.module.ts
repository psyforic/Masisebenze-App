import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityLogComponent } from './activity-log.component';
import { PartialsModule } from '../partials/partials.module';



@NgModule({
  declarations: [ActivityLogComponent],
  imports: [
    CommonModule,
    PartialsModule
  ]
})
export class ActivityLogModule { }
