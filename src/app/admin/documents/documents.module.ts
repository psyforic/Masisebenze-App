import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentsComponent } from './documents.component';
import { PartialsModule } from '../partials/partials.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NewDocumentComponent } from './new-document/new-document.component';
import { MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

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
  entryComponents: [NewDocumentComponent],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }]
})
export class DocumentsModule { }
