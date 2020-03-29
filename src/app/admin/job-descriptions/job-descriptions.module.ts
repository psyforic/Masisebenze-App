import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobDescriptionsComponent } from './job-descriptions.component';
import { NewJobDescriptionComponent } from './new-job-description/new-job-description.component';
import { EditJobDescriptionComponent } from './edit-job-description/edit-job-description.component';
import { PartialsModule } from '../partials/partials.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    JobDescriptionsComponent,
    EditJobDescriptionComponent],
  imports: [
    PartialsModule,
    NgbModule,
    CommonModule
  ]
  , entryComponents: [
    NewJobDescriptionComponent,
    EditJobDescriptionComponent
  ]

})
export class JobDescriptionsModule { }
