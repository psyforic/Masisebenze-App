import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttorneysComponent } from './attorneys/attorneys.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ClientsComponent } from './clients/clients.component';



@NgModule({
  declarations: [AttorneysComponent, ContactsComponent, ClientsComponent],
  imports: [
    CommonModule
  ]
})
export class LawfirmsModule { }
