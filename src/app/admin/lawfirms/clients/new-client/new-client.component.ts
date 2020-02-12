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
  LawFirmListDto,
  CreateBookingInput,
  BookingServiceProxy
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss'],
  providers: [ClientServiceProxy, LawFirmServiceProxy, BookingServiceProxy]
})
export class NewClientComponent extends AppComponentBase implements OnInit {
  datePickerConfig: Partial<BsDatepickerConfig>;
  @ViewChild('content', { static: false }) content: ElementRef;
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
  courtDate: any;
  assessmentDate: any;
  startTime: any;
  endTime: any;
  clientInput: CreateClientInput = new CreateClientInput();
  booking: CreateBookingInput = new CreateBookingInput();
  constructor(private injector: Injector,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private clientService: ClientServiceProxy,
    private lawFirmService: LawFirmServiceProxy) {
    super(injector);
  }
  ngOnInit(): void {
    this.initializeForm();

  }
  initializeForm() {
    this.clientForm = this.fb.group({
      lawFirmId: ['', Validators.required],
      attorneyId: ['', Validators.required],
      contactId: ['', Validators.required],
      courtDate: [''],
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      idNumber: ['', [Validators.required, Validators.maxLength(13), Validators.minLength(13)]],
      assessmentDate: ['', Validators.required]
    });
  }
  open() {
    this.getLawFirms();
    this.getLawFirmAttorneys();
    this.getLawFirmContacts();
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }
  getLawFirms() {
    this.isSaving = true;
    this.lawFirmService.getLawFirms(this.filter)
      .pipe(finalize(() => {
        this.isSaving = false;
      }))
      .subscribe((result) => {
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
    this.lawFirmId = event.value;
    this.getLawFirmAttorneys();
    this.getLawFirmContacts();
  }
  setStartTime(event) {
    this.startTime = event;
  }
  setEndTime(event) {
    this.endTime = event;
  }
  save() {
    this.isSaving = true;
    // const courtDate = new Date(this.clientForm.get('courtDate').value);
    // const formattedCourtDate = moment(courtDate).format('YYYY-MM-DD');
    const assessmentDate = new Date(this.clientForm.get('assessmentDate').value);
    const formattedAssessmentDate = moment(assessmentDate).format('YYYY-MM-DD');

    this.clientInput = Object.assign({}, this.clientForm.value);
    this.clientInput.assessmentDate = this.assessmentDate;
    this.clientInput.courtDate = this.courtDate;
    this.clientInput.startTime = moment(formattedAssessmentDate + ' ' + this.startTime + '+0000', 'YYYY-MM-DD HH:mm Z');
    this.clientInput.endTime = moment(formattedAssessmentDate + ' ' + this.endTime + '+0000', 'YYYY-MM-DD HH:mm Z');
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
  courtDateChanged(event) {
    this.courtDate = event.value;
    let hoursDiff: number;
    let minutesDiff: number;
    if (this.courtDate !== null && this.courtDate !== 'undefined' && !this.isValidDate(this.courtDate)) {
      this.courtDate = new Date(this.courtDate);
      hoursDiff = this.courtDate.getHours() - this.courtDate.getTimezoneOffset() / 60;
      minutesDiff = (this.courtDate.getHours() - this.courtDate.getTimezoneOffset()) % 60;
      this.courtDate.setHours(hoursDiff);
      this.courtDate.setMinutes(minutesDiff);
    }
    this.clientInput.courtDate = this.courtDate;
  }
  isValidDate(d) {
    const s = Date.parse(d);
    return isNaN(s);
  }
  assessmentDateChanged(event) {
    this.assessmentDate = event.value;
    let hoursDiff: number;
    let minutesDiff: number;
    if (this.assessmentDate !== null && this.assessmentDate !== 'undefined' && !this.isValidDate(this.assessmentDate)) {
      this.assessmentDate = new Date(this.assessmentDate);
      hoursDiff = this.assessmentDate.getHours() - this.assessmentDate.getTimezoneOffset() / 60;
      minutesDiff = (this.assessmentDate.getHours() - this.assessmentDate.getTimezoneOffset()) % 60;
      this.assessmentDate.setHours(hoursDiff);
      this.assessmentDate.setMinutes(minutesDiff);
    }
    this.assessmentDate.authorDate = this.assessmentDate;
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
