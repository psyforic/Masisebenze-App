import { JobDescriptionsModule } from '@app/admin/job-descriptions/job-descriptions.module';
import { QuestionnaireComponent } from './assessments/functional-assessment/questionnaire/questionnaire.component';
import { NewJobDescriptionComponent } from './../../job-descriptions/new-job-description/new-job-description.component';
import { ReportSummaryComponent } from './view-client/report-summary/report-summary.component';
import { CognitiveAssessmentsModule } from './assessments/cognitive-assessments/cognitive-assessments.module';
import { CognitiveAssessmentsComponent } from './assessments/cognitive-assessments/cognitive-assessments.component';
import { WorkInformationComponent } from './work-information/work-information.component';
import { QuestionnaireCommentComponent } from './assessments/functional-assessment/questionnaire-comment/questionnaire-comment.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import { ViewClientComponent } from './view-client/view-client.component';
import { NewClientComponent } from './new-client/new-client.component';
import { PartialsModule } from '@app/admin/partials/partials.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ViewActivityLogComponent } from './view-activity-log/view-activity-log.component';
import { VerticalTimelineModule } from 'angular-vertical-timeline';
import { CameraModalComponent } from './camera-modal/camera-modal.component';
import { WebcamModule } from 'ngx-webcam';
import { ImageCropperModule } from 'ngx-image-cropper';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
import { AdminCommentsComponent } from './admin-comments/admin-comments.component';
import { AssessmentsModule } from './assessments/assessments.module';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MAT_DATE_LOCALE, MatDividerModule } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { PreventUnsavedChangesGuard } from '@app/admin/guards/prevent-unsaved-changes.guard';
import {MatChipsModule} from '@angular/material/chips';
import { TypeaheadModule } from 'ngx-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [
    ClientsComponent,
    EditClientComponent,
    ViewClientComponent,
    ViewActivityLogComponent,
    CameraModalComponent,
    UploadDocumentComponent,
    AdminCommentsComponent,
    QuestionnaireCommentComponent,
    WorkInformationComponent,
    ReportSummaryComponent,
    QuestionnaireComponent,
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    PartialsModule,
    VerticalTimelineModule,
    WebcamModule,
    ImageCropperModule,
    AssessmentsModule,
    CognitiveAssessmentsModule,
    MatChipsModule,
    PerfectScrollbarModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    TypeaheadModule.forRoot()
  ],
  exports: [
    NewClientComponent, ReportSummaryComponent, DragDropModule, QuestionnaireCommentComponent
  ],
  entryComponents: [NewClientComponent, CameraModalComponent, NewJobDescriptionComponent, QuestionnaireCommentComponent],
  providers: [NgbActiveModal,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    PreventUnsavedChangesGuard]
})
export class ClientsModule { }
