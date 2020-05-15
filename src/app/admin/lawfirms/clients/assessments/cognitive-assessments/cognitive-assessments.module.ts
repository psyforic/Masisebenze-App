
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CognitiveAssessmentsComponent } from './cognitive-assessments.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatTabsModule, MatInputModule } from '@angular/material';
import { PartialsModule } from '@app/admin/partials/partials.module';


@NgModule({
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    PartialsModule
  ],
  declarations: [
  CognitiveAssessmentsComponent,

],
  exports: [
    CognitiveAssessmentsComponent
  ],
  providers: [

  ],
  entryComponents: [

  ]
})
export class CognitiveAssessmentsModule { }
