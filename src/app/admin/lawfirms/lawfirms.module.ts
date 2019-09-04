import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttorneysComponent } from './attorneys/attorneys.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ClientsComponent } from './clients/clients.component';
import { LawfirmsComponent } from './lawfirms/lawfirms.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  MatExpansionModule,
  MatTabsModule,
  MatDividerModule,
  MatTooltipModule,
  MatDialogModule
} from '@angular/material';
import { PartialsModule } from '../partials/partials.module';
import { RouterModule } from '@angular/router';
import { AttorneysModule } from './attorneys/attorneys.module';
import { ClientsModule } from './clients/clients.module';
import { NewLawfirmComponent } from './lawfirms/new-lawfirm/new-lawfirm.component';
import { EditLawfirmComponent } from './lawfirms/edit-lawfirm/edit-lawfirm.component';
import { ViewLawfirmComponent } from './lawfirms/view-lawfirm/view-lawfirm.component';



@NgModule({
  declarations: [
    ContactsComponent,
    LawfirmsComponent,
    NewLawfirmComponent,
    EditLawfirmComponent,
    ViewLawfirmComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AttorneysModule,
    ClientsModule,
    PartialsModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatExpansionModule,
    MatTabsModule,
    MatDividerModule,
    MatTooltipModule,
    MatDialogModule,
    ClientsModule
  ]
})
export class LawfirmsModule { }
