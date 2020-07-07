import { PartialsModule } from './../partials/partials.module';
import { MailSettingsComponent } from '../mail-settings/mail-settings.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [MailSettingsComponent],
  imports: [
    CommonModule,
    PartialsModule
  ]
})
export class MailSettingsModule { }
