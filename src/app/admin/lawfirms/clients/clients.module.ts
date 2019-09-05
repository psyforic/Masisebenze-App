import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import { ViewClientComponent } from './view-client/view-client.component';
import { NewClientComponent } from './new-client/new-client.component';
import { PartialsModule } from '@app/admin/partials/partials.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';



@NgModule({
  declarations: [
    ClientsComponent,
    EditClientComponent,
    NewClientComponent,
    ViewClientComponent
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    PartialsModule,
  ],
  entryComponents: [NewClientComponent]
})
export class ClientsModule { }
