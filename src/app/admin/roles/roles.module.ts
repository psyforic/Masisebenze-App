import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesComponent } from './roles.component';
import { CreateRoleDialogComponent } from './create-role/create-role-dialog.component';
import { EditRoleDialogComponent } from './edit-role/edit-role-dialog.component';
import { PartialsModule } from '../partials/partials.module';

@NgModule({
  imports: [
    CommonModule,
    PartialsModule
  ],
  declarations: [
    RolesComponent,
    CreateRoleDialogComponent,
    EditRoleDialogComponent
  ],
  entryComponents: [
    CreateRoleDialogComponent,
    EditRoleDialogComponent]
})
export class RolesModule { }
