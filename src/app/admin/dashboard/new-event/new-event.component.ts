import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Injector } from '@angular/core';
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { PagedRequestDto } from '@shared/paged-listing-component-base';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss'],
  providers: [LawFirmServiceProxy, ClientServiceProxy, BookingServiceProxy]
})
export class NewEventComponent extends AppComponentBase implements OnInit {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Output() newBookingInput = new EventEmitter();

  date: string;
  startTime: any;
  endTime: any;
  bookingName: string;
  booking: CreateBookingInput = new CreateBookingInput();
  clients: ClientListDto[] = [];
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
  events: EventListDto[] = [];
  constructor(private injector: Injector, private modalService: NgbModal,
    private bookingService: BookingServiceProxy,
    private clientService: ClientServiceProxy,
    private lawFirmService: LawFirmServiceProxy) {
    super(injector);
  }
  ngOnInit(): void {
    this.getEvents();
    this.getLawFirms();

  }
  open(arg) {
    this.date = arg.dateStr;
    this.modalService.open(this.content, { windowClass: 'slideInDown' }).result.then(() => { }, () => { });
  }
  save() {
    this.booking.startTime = moment(this.date + ' ' + this.startTime + '+0000', 'YYYY-MM-DD HH:mm Z');
    this.booking.endTime = moment(this.date + ' ' + this.endTime + '+0000', 'YYYY-MM-DD HH:mm Z');
    this.bookingService.createBooking(this.booking)
      .pipe(finalize(() => {
      }))
      .subscribe(() => {
        this.notify.success('Event Booking Created Successfully');
        const client = this.filteredClients.find(x => x.id === this.clientId);
        this.newBookingInput.emit([this.booking, client.firstName + ' ' + client.lastName]);
        this.modalService.dismissAll();
      });
  }

  setStartTime(event) {
    this.startTime = event;
  }
  setEndTime(event) {
    this.endTime = event;
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
      console.log(this.attorneys);
    });
  }
  getLawFirmContacts() {
    this.lawFirmService.getContacts(this.lawFirmId).pipe(finalize(() => {
    })).subscribe((result) => {
      this.contacts = result.items;
    });
  }
  getClients() {
    this.clientService.getByContactAttorneyId(this.attorneyId, this.contactId)
      .pipe(finalize(() => { }))
      .subscribe((result) => {
        this.filteredClients = result.items;
      });
  }
  getEvents() {
    this.bookingService.getAllEvents(this.filter).subscribe((result) => {
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
  }
}
