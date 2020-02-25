
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
import { MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { PreventUnsavedChangesGuard } from '@app/admin/guards/prevent-unsaved-changes.guard';
@NgModule({
  declarations: [
    ClientsComponent,
    EditClientComponent,
    NewClientComponent,
    ViewClientComponent,
    ViewActivityLogComponent,
    CameraModalComponent,
    UploadDocumentComponent,
    AdminCommentsComponent,
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    PartialsModule,
    VerticalTimelineModule,
    WebcamModule,
    ImageCropperModule,
    AssessmentsModule
  ],
  exports: [
    NewClientComponent
  ],
  entryComponents: [NewClientComponent, CameraModalComponent],
  providers: [NgbActiveModal,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    PreventUnsavedChangesGuard]
})
export class ClientsModule { }
