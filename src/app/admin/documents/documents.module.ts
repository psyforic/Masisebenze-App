import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsComponent } from './documents.component';
import { PartialsModule } from '../partials/partials.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NewDocumentComponent } from './new-document/new-document.component';

@NgModule({
  imports: [
    CommonModule,
    PartialsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: DocumentsComponent
      }
    ]),
  ],
  declarations: [DocumentsComponent, NewDocumentComponent],
  entryComponents: [NewDocumentComponent]
})
export class DocumentsModule { }
