import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import {
  CreateBookingInput,
  BookingServiceProxy,
  ClientServiceProxy,
  BookingListDto,
  ClientListDto
} from '@shared/service-proxies/service-proxies';
import { PagedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import * as  moment from 'moment';

@Component({
  selector: 'app-new-booking',
  templateUrl: './new-booking.component.html',
  styleUrls: ['./new-booking.component.scss'],
  providers: [BookingServiceProxy, ClientServiceProxy]
})
export class NewBookingComponent extends PagedListingComponentBase<BookingListDto> {

  @ViewChild('content', { static: false }) content: ElementRef;
  @Output() newBookingInput = new EventEmitter();
  date: string;
  time: any;
  bookingName: string;
  booking: CreateBookingInput = new CreateBookingInput();
  clients: ClientListDto[] = [];
  constructor(private injector: Injector, private modalService: NgbModal,
    private bookingService: BookingServiceProxy,
    private clientService: ClientServiceProxy) {
    super(injector);
  }
  open(arg) {
    this.date = arg.dateStr;
    this.modalService.open(this.content).result.then(() => { }, () => { });
  }
  save() {
    this.booking.startTime = moment(this.date + ' ' + this.time + '+0000', 'YYYY-MM-DD HH:mm Z');
    this.bookingService.createBooking(this.booking)
      .pipe(finalize(() => {
      }))
      .subscribe(() => {
        this.notify.success('Assessment Booking Successfully');
        this.newBookingInput.emit([this.booking, this.bookingName]);
        this.modalService.dismissAll();
      });
  }
  selectedClient(event) {
    this.clientService.getById(event.target.value).subscribe((result) => {
      this.bookingName = result.firstName + ' ' + result.lastName;
    });
  }
  setTime(event) {
    this.time = event;
  }
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.clientService.getAll(request.sorting, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => {
      }))
      .subscribe((result) => {
        this.clients = result.items;
        console.log('Clients', this.clients);
      });
  }
  protected delete(entity: BookingListDto): void {
    //
  }
}
