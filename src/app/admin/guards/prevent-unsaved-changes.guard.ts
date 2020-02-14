import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ViewClientComponent } from '../lawfirms/clients/view-client/view-client.component';

@Injectable()
export class PreventUnsavedChangesGuard implements CanDeactivate<ViewClientComponent> {
  canDeactivate(component: ViewClientComponent) {
    if (component.clientForm.dirty) {
      return confirm('Are you sure you want to continue? any unsaved changes will be lost.\nPress Cancel to save changes and continue.');
    }
    return true;
  }
}
