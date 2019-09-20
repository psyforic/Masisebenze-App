import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input, Injector } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Contact } from '../../attorneys/new-attorney/new-attorney.component';
import { CreateContactInput, ContactServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'kt-new-contact',
  templateUrl: './new-contact.component.html',
  styleUrls: ['./new-contact.component.scss'],
  providers: [ContactServiceProxy]
})
export class NewContactComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Output() newContact = new EventEmitter();
  @Input() lawFirmId = new Input();
  closeResult: string;
  contact: CreateContactInput = new CreateContactInput();
  constructor(private injector: Injector, private modalService: NgbModal,
    private contactService: ContactServiceProxy) {
    super(injector);
  }
  ngOnInit(): void {
    this.contact.lawFirmId = this.lawFirmId;
  }

  open() {
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }
  contactAdded() {
    this.newContact.emit(this.contact);
    this.modalService.dismissAll();
  }
  save() {
    this.contactService.create(this.contact)
      .pipe(finalize(() => { }))
      .subscribe(() => {
        this.notify.success('Saved Successfully');
        this.newContact.emit(this.contact);
        this.modalService.dismissAll();
      });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
