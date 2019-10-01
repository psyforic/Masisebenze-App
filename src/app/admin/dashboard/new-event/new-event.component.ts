import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Injector, Input } from '@angular/core';
import {
  CreateBookingInput,
  ClientListDto,
  BookingServiceProxy,
  ClientServiceProxy,
  LawFirmServiceProxy,
  LawFirmListDto,
  AttorneyListDto,
  ContactListDto,
  EventListDto
} from '@shared/service-proxies/service-proxies';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { NgForm } from '@angular/forms';
import { GeneralService } from '@app/admin/services/general.service';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss'],
  providers: [
    LawFirmServiceProxy,
    ClientServiceProxy,
    BookingServiceProxy,
    NgbActiveModal
  ]
})
export class NewEventComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Output() newBookingInput = new EventEmitter();
  @Output() newBottomSheetClient = new EventEmitter();
  @Input() clients: ClientListDto[] = [];
  @ViewChild('newEvent', { static: false }) newEventForm: NgForm;

  date: string;
  startTime: any;
  endTime: any;
  bookingName: string;
  booking: CreateBookingInput = new CreateBookingInput();

  lawFirms: LawFirmListDto[] = [];
  attorneys: AttorneyListDto[] = [];
  contacts: ContactListDto[] = [];
  filteredClients: ClientListDto[] = [];
  filter = '';
  isActive = true;
  lawFirmId: string;
  attorneyId: string;
  clientId: string;
  contactId: string;
  isSaving = false;
  events: EventListDto[] = [];
  showHeader = false;
  constructor(
    private injector: Injector,
    private modalService: NgbModal,
    private generalService: GeneralService,
    private bookingService: BookingServiceProxy,
    private clientService: ClientServiceProxy,
    private lawFirmService: LawFirmServiceProxy) {
    super(injector);

  }
  ngOnInit(): void {
    this.generalService.componentMethodCalled$.subscribe(() => {
      this.getClients();
    });
  }
  open(arg) {
    this.getEvents();
    this.getLawFirms();
    this.date = arg.dateStr;
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  save(form: NgForm) {
    this.isSaving = true;
    this.booking.startTime = moment(this.date + ' ' + this.startTime + '+0000', 'YYYY-MM-DD HH:mm Z');
    this.booking.endTime = moment(this.date + ' ' + this.endTime + '+0000', 'YYYY-MM-DD HH:mm Z');
    this.bookingService.createBooking(this.booking)
      .pipe(finalize(() => {
        this.isSaving = false;
      }))
      .subscribe(() => {
        this.notify.success('Event Booking Created Successfully');
        const client = this.filteredClients.find(x => x.id === this.clientId);
        this.newBookingInput.emit([this.booking, client.firstName + ' ' + client.lastName]);
        this.close(form);
      });
  }

  setStartTime(event) {
    this.startTime = event;
  }
  setEndTime(event) {
    this.endTime = event;
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
    this.isSaving = true;
    this.lawFirmService.getAttorneys(this.lawFirmId)
      .pipe(finalize(() => {
        this.isSaving = false;
      }))
      .subscribe((result) => {
        this.attorneys = result.items;
      });
  }
  getLawFirmContacts() {
    this.isSaving = true;
    this.lawFirmService.getContacts(this.lawFirmId).pipe(finalize(() => {
      this.isSaving = false;
    })).subscribe((result) => {
      this.contacts = result.items;
    });
  }
  getClients() {

    this.clientService.getByContactAttorneyId(this.attorneyId, this.contactId)
      .pipe(finalize(() => { this.isSaving = false; }))
      .subscribe((result) => {
        this.filteredClients = result.items;
      });
  }
  getEvents() {
    this.isSaving = true;
    this.bookingService.getAllEvents(this.filter)
      .pipe(finalize(() => {
        this.isSaving = true;
      }))
      .subscribe((result) => {
        this.events = result.items;
      });
  }
  selectAttorneyId(event) {
    this.attorneyId = event.value;
  }
  selectedClientId(event) {
    this.clientId = event.value;
  }
  selectedLawFirmId(event) {
    this.lawFirmId = event.value;
    this.getLawFirmAttorneys();
    this.getLawFirmContacts();
  }
  selectedContactId(event) {
    this.contactId = event.value;
    this.getClients();
    this.showHeader = true;
  }
  openBottomSheet() {
    const clientInfo = {
      lawFirmId: this.booking.lawFirmId,
      attorneyId: this.booking.attorneyId,
      contactId: this.booking.contactId,
      date: this.date
    };
    this.newBottomSheetClient.emit(clientInfo);
  }
  close(form: NgForm) {
    form.reset();
    form.control.markAsUntouched();
    this.showHeader = false;
    this.modalService.dismissAll();
  }
}
