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
@NgModule({
  declarations: [
    ClientsComponent,
    EditClientComponent,
    NewClientComponent,
    ViewClientComponent,
    ViewActivityLogComponent,
    CameraModalComponent,
    UploadDocumentComponent
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    PartialsModule,
    VerticalTimelineModule,
    WebcamModule,
    ImageCropperModule
  ],
  exports: [
    NewClientComponent
  ],
  entryComponents: [NewClientComponent, CameraModalComponent]
})
export class ClientsModule { }
