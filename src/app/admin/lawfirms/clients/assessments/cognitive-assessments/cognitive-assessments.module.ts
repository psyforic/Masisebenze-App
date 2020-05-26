import { DragDropModule } from '@angular/cdk/drag-drop';
import { CognitiveCommentComponent } from './cognitive-comment/cognitive-comment.component';
import { NgxAudioPlayerModule } from 'ngx-audio-player';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CognitiveAssessmentsComponent } from './cognitive-assessments.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatTabsModule, MatInputModule } from '@angular/material';
import { PartialsModule } from '@app/admin/partials/partials.module';
import { ViewFileComponent } from './view-file/view-file.component';


@NgModule({
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    DragDropModule,
    PartialsModule,
    NgxAudioPlayerModule
  ],
  declarations: [
  CognitiveAssessmentsComponent,
  CognitiveCommentComponent,
  ViewFileComponent

],
  exports: [
    CognitiveAssessmentsComponent,
    CognitiveCommentComponent
  ],
  providers: [

  ],
  entryComponents: [
    CognitiveCommentComponent,
    ViewFileComponent
  ]
})
export class CognitiveAssessmentsModule { }
