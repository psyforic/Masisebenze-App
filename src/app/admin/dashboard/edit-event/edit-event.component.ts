import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Injector } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  EventListDto,
  BookingServiceProxy,
  BookingDetailOutput
} from '@shared/service-proxies/service-proxies';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import { MAT_DATE_LOCALE } from '@angular/material';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
  providers: [BookingServiceProxy]
})
export class EditEventComponent extends AppComponentBase implements OnInit {


  @ViewChild('content', { static: false }) content: ElementRef;
  @Output() editBookingInput = new EventEmitter();
  @Output() newBottomSheetClient = new EventEmitter();
  @ViewChild('newEvent', { static: false }) newEventForm: NgForm;

  date: string;
  startTime: any;
  endTime: any;
  bookingName: string;
  booking: BookingDetailOutput = new BookingDetailOutput();
  filter = '';
  isActive = true;
  events: EventListDto[] = [];
  fromTime: string;
  toTime: string;
  clientName: string;
  isSaving = false;
  isLoading = false;
  attorneyName: string;
  reason: string;
  lawFirmName: string;
  contactName: string;
  constructor(private injector: Injector, private modalService: NgbModal,
    private bookingService: BookingServiceProxy) {
    super(injector);
  }
  ngOnInit(): void {

  }
  open(date, id) {
    this.isLoading = true;
    this.bookingService.getDetail(id)
      .pipe(finalize(() => {
        this.toTime = moment(this.booking.endTime).format('H:mm a');
        this.fromTime = moment(this.booking.startTime).format('H:mm a');
        this.getEvents();
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.booking = result;
        this.clientName = result.client.firstName + ' ' + result.client.lastName;
        this.lawFirmName = result.lawFirm.companyName;
        this.attorneyName = result.attorney.firstName + ' ' + result.attorney.lastName;
        this.contactName = result.contact.firstName + ' ' + result.contact.lastName;
        this.startTime = moment(result.startTime).format('H:mm');
        console.log(this.startTime);
        this.endTime = moment(result.endTime).format('h:mm');
      });

    this.date = date;
    this.modalService.open(this.content, { windowClass: 'slideInDown', backdrop: 'static', keyboard: false, size: 'lg' })
      .result.then(() => { }, () => { });
  }
  save(form: NgForm) {
    this.isSaving = true;
    this.date = moment(this.date).format('YYYY-MM-DD');
    this.booking.startTime = moment(this.date + ' ' + this.startTime + '+0000', 'YYYY-MM-DD HH:mm Z');
    this.booking.endTime = moment(this.date + ' ' + this.endTime + '+0000', 'YYYY-MM-DD HH:mm Z');
    this.booking.reason = this.reason;
    this.bookingService.createBooking(this.booking)
      .pipe(finalize(() => {
        this.isSaving = false;
      }))
      .subscribe(() => {
        this.notify.success('Event Booking Updated Successfully');
        this.editBookingInput.emit([this.booking, this.booking.client.firstName + ' ' + this.booking.client.lastName]);
        this.close(form);
      });
  }

  setStartTime(event, form: NgForm) {
    this.startTime = event;
    form.control.markAsDirty();
  }
  setEndTime(event, form: NgForm) {
    this.endTime = event;
    form.control.markAsDirty();
  }
  getEvents() {
    this.bookingService.getAllEvents(this.filter).subscribe((result) => {
      this.events = result.items;
    });
  }
  close(form: NgForm) {
    form.reset();
    form.control.markAsUntouched();
    this.modalService.dismissAll();
  }
  protected deleteEvent(form: NgForm): void {
    abp.message.confirm(
      'Delete \'' + this.booking.event.name + '\'' + ' For ' + this.booking.client.firstName + ' ' + this.booking.client.lastName + '?',
      (result: boolean) => {
        if (result) {
          this.bookingService.delete(this.booking.id).pipe(finalize(() => {
            abp.notify.success('Deleted Event: ' + this.booking.client.firstName + ' ' + this.booking.client.lastName);
          })).subscribe(() => {
            this.editBookingInput.emit(null);
            this.close(form);
          });
        }
      }
    );
  }
}
