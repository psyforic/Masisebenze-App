import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { CreateUserDialogComponent } from './create-user/create-user-dialog.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditUserDialogComponent } from './edit-user/edit-user-dialog.component';
import { ResetPasswordDialogComponent } from './reset-password/reset-password.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    UsersComponent,
    CreateUserDialogComponent,
    ChangePasswordComponent,
    EditUserDialogComponent,
    ResetPasswordDialogComponent]
})
export class UsersModule { }
