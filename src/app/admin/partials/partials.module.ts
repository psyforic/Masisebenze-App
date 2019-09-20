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
  MatTreeModule,
  MatBottomSheetModule,
  MAT_BOTTOM_SHEET_DEFAULT_OPTIONS
} from '@angular/material';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { QuillModule } from 'ngx-quill';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ModalModule.forRoot(),
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
    MatBottomSheetModule,
    BsDropdownModule.forRoot(),
    QuillModule.forRoot({
      modules: {
        syntax: false,
        toolbar: [
          ['bold', 'italic'],
          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          [{ 'align': [] }],                        // link and image, video]
        ]
      }
    })
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
    MatBottomSheetModule,
    NgxMaterialTimepickerModule,
    MatTreeModule,
    BsDropdownModule,
    QuillModule
  ],
  providers: [BsModalService,
    { provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }]
})
export class PartialsModule { }
