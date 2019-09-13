import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { CreateUserDialogComponent } from './create-user/create-user-dialog.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditUserDialogComponent } from './edit-user/edit-user-dialog.component';
import { ResetPasswordDialogComponent } from './reset-password/reset-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PartialsModule } from '../partials/partials.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PartialsModule
  ],
  declarations: [
    UsersComponent,
    CreateUserDialogComponent,
    ChangePasswordComponent,
    EditUserDialogComponent,
    ResetPasswordDialogComponent],
  entryComponents: [
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ResetPasswordDialogComponent]
})
export class UsersModule { }
