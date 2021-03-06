import { InitialPipe } from './../../../shared/pipes/initial.pipe';


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
import { NewContactComponent } from './lawfirms/new-contact/new-contact.component';
import { NewClientComponent } from './lawfirms/new-client/new-client.component';
import { NewAttorneyComponent } from './lawfirms/new-attorney/new-attorney.component';
import { EditContactComponent } from './contacts/edit-contact/edit-contact.component';
import { PostureServiceProxy } from '@shared/service-proxies/service-proxies';
import { JobDescriptionsModule } from '../job-descriptions/job-descriptions.module';



@NgModule({
  declarations: [
    ContactsComponent,
    EditContactComponent,
    LawfirmsComponent,
    EditLawfirmComponent,
    ViewLawfirmComponent,
    NewContactComponent,
    NewClientComponent,
    NewAttorneyComponent
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
  ],
  entryComponents: [NewClientComponent, NewContactComponent]
})
export class LawfirmsModule { }
