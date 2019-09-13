import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';

// NgBootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  MatButtonModule,
  MatMenuModule,
  MatSelectModule,
  MatInputModule,
  MatTableModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatIconModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatDatepickerModule,
  MatCardModule,
  MatPaginatorModule,
  MatSortModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatTabsModule,
  MatTooltipModule,
  MatDialogModule,
  MatExpansionModule,
  MatTreeModule
} from '@angular/material';
import { QuillModule } from 'ngx-quill';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ModalModule.forRoot(),
    QuillModule.forRoot({
      modules: {
        syntax: true,
        toolbar: [
          ['bold', 'italic', 'underline'],        // toggled buttons
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'font': [] }],
          [{ 'align': [] }],

          ['clean']
        ]
      }
    }),
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatIconModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogModule,
    MatExpansionModule,
    NgxMaterialTimepickerModule,
    MatTreeModule,
    BsDropdownModule.forRoot()
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatIconModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogModule,
    MatExpansionModule,
    QuillModule,
    NgxMaterialTimepickerModule,
    MatTreeModule,
    BsDropdownModule
  ],
  providers: [BsModalService]
})
export class PartialsModule { }
