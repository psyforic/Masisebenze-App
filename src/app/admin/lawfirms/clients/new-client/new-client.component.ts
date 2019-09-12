import { Component, OnInit, ViewChild, ElementRef, Injector, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppComponentBase } from '@shared/app-component-base';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {
  ClientServiceProxy,
  CreateClientInput,
  ContactListDto,
  AttorneyListDto,
  LawFirmServiceProxy,
  LawFirmListDto
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss'],
  providers: [ClientServiceProxy, LawFirmServiceProxy]
})
export class NewClientComponent extends AppComponentBase implements OnInit {
  datePickerConfig: Partial<BsDatepickerConfig>;
  @ViewChild('content', { static: false }) content: ElementRef;
  @ViewChild('courtDate', { static: false }) courtDate: ElementRef;
  @ViewChild('assessmentDate', { static: false }) assessmentDate: ElementRef;
  @Output() clientAdded = new EventEmitter();
  closeResult: string;
  filter = '';
  clientForm: FormGroup;
  isSaving = false;
  attorneys: AttorneyListDto[] = [];
  contacts: ContactListDto[] = [];
  lawFirms: LawFirmListDto[] = [];
  lawFirmId: string;
  dateModel: Date;
  clientInput: CreateClientInput = new CreateClientInput();
  constructor(private injector: Injector,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private clientService: ClientServiceProxy,
    private lawFirmService: LawFirmServiceProxy) {
    super(injector);
  }
  ngOnInit(): void {
    this.initializeForm();
    this.getLawFirms();
    this.getLawFirmAttorneys();
    this.getLawFirmContacts();
  }
  initializeForm() {
    this.clientForm = this.fb.group({
      lawFirmId: ['', Validators.required],
      attorneyId: ['', Validators.required],
      contactId: ['', Validators.required],
      courtDate: ['', Validators.required],
      caseNumber: ['', Validators.required],
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      idNumber: ['', Validators.required],
      assessmentDate: ['', Validators.required]
    });
  }
  open() {
    this.modalService.open(this.content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  getLawFirms() {
    this.lawFirmService.getLawFirms(this.filter).subscribe((result) => {
      this.lawFirms = result.items;
      this.lawFirmId = this.lawFirms[0].id;
    });
  }
  getLawFirmAttorneys() {
    this.lawFirmService.getAttorneys(this.lawFirmId).subscribe((result) => {
      this.attorneys = result.items;
    });
  }
  getLawFirmContacts() {
    this.lawFirmService.getContacts(this.lawFirmId).subscribe((result) => {
      this.contacts = result.items;
    });
  }
  selectedId(event) {
    this.lawFirmId = event.target.value;
    this.getLawFirmAttorneys();
    this.getLawFirmContacts();
  }
  selectedDate(event) {
    console.log(event.target.value);
  }
  save() {
    this.isSaving = true;
    this.clientInput = Object.assign({}, this.clientForm.value);
    this.clientService.createClient(this.clientInput)
      .pipe(finalize(() => {
        this.isSaving = false;
      }))
      .subscribe(() => {
        this.notify.success('Saved Successfully');
        this.clientAdded.emit(this.clientInput);
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
