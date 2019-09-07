import { Component, ViewChild, ElementRef, Output, EventEmitter, Input, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ContactServiceProxy, ContactDetailOutput, ContactListDto } from '@shared/service-proxies/service-proxies';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss']
})
export class EditContactComponent extends AppComponentBase {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Output() editedContact = new EventEmitter();
  @Input() lawFirmId = new Input();
  contactId: string;
  contact: ContactDetailOutput = new ContactDetailOutput();
  constructor(private injector: Injector, private modalService: NgbModal,
    private contactService: ContactServiceProxy) {
    super(injector);
  }
  open(id: string) {
    this.contactService.getDetail(id).subscribe((result) => {
      this.contact = result;
    });
    this.modalService.open(this.content).result.then(() => { },
      () => { });
  }
  save() {
    this.contactService.editContact(this.contact)
      .pipe(finalize(() => { }))
      .subscribe(() => {
        this.notify.success('Updated Successfully');
        this.editedContact.emit(this.contact);
        this.modalService.dismissAll();
      });
  }
  delete(entity: ContactListDto): void {
    abp.message.confirm(
      'Delete Contact \'' + entity.firstName + '\'?',
      (result: boolean) => {
        if (result) {
          this.contactService.delete(entity.id).pipe(finalize(() => {
            abp.notify.success('Deleted Contact: ' + entity.firstName);
            this.editedContact.emit(null);
          })).subscribe(() => { });
        }
      }
    );
  }

}
