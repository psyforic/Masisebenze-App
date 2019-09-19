import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Injector } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  CreateBookingInput,
  ClientListDto,
  LawFirmListDto,
  AttorneyListDto,
  ContactListDto,
  EventListDto,
  BookingServiceProxy,
  ClientServiceProxy,
  LawFirmServiceProxy,
  BookingDetailOutput
} from '@shared/service-proxies/service-proxies';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
  providers: [BookingServiceProxy, ClientServiceProxy, LawFirmServiceProxy]
})
export class EditEventComponent extends AppComponentBase implements OnInit {


  @ViewChild('content', { static: false }) content: ElementRef;
  @Output() newBookingInput = new EventEmitter();
  @Output() newBottomSheetClient = new EventEmitter();
  @ViewChild('newEvent', { static: false }) newEventForm: NgForm;

  date: string;
  startTime: any;
  endTime: any;
  bookingName: string;
  booking: BookingDetailOutput = new BookingDetailOutput();
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
  fromTime: string;
  toTime: string;
  showHeader = false;
  clientName: string;
  constructor(private injector: Injector, private modalService: NgbModal,
    private bookingService: BookingServiceProxy,
    private clientService: ClientServiceProxy,
    private lawFirmService: LawFirmServiceProxy) {
    super(injector);
  }
  ngOnInit(): void {

  }
  open(date, id) {
    this.bookingService.getDetail(id)
      .pipe(finalize(() => {
        this.toTime = moment(this.booking.endTime).format('h:mm a');
        this.fromTime = moment(this.booking.startTime).format('h:mm a');
      }))
      .subscribe((result) => {
        this.booking = result;
        this.clientName = result.client.firstName + ' ' + result.client.lastName;
      });
    this.getEvents();
    this.getLawFirms();
    this.getLawFirmAttorneys();
    this.getClients();
    this.getLawFirmContacts();
    this.date = date;

    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false })
      .result.then(() => { }, () => { });
  }
  save() {
    this.booking.startTime = moment(this.date + ' ' + this.startTime + '+0000', 'YYYY-MM-DD HH:mm Z');
    this.booking.endTime = moment(this.date + ' ' + this.endTime + '+0000', 'YYYY-MM-DD HH:mm Z');
    this.bookingService.editBooking(this.booking)
      .pipe(finalize(() => {
      }))
      .subscribe(() => {
        this.notify.success('Event Updated Successfully');
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
      this.lawFirmId = this.booking.lawFirmId;
    });
  }
  getLawFirmAttorneys() {
    this.lawFirmService.getAttorneys(this.lawFirmId).subscribe((result) => {
      this.attorneys = result.items;
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
    this.showHeader = true;
  }
  openBottomSheet() {
    const clientInfo = {
      lawFirmId: this.booking.lawFirmId,
      attorneyId: this.booking.attorneyId,
      contactId: this.booking.contactId
    };
    this.newBottomSheetClient.emit(clientInfo);
  }

}
