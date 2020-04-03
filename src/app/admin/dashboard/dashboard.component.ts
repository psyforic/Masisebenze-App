import { DatePipe } from '@angular/common';
import { style } from '@angular/animations';
import { OnetWebService } from './../services/onet-web.service';
import { Component, OnInit, Injector, ViewChild, AfterViewInit, Output } from '@angular/core';
import * as Chartist from 'chartist';
import { AppComponentBase } from '@shared/app-component-base';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { BookingServiceProxy, BookingListDto, DashBoardServiceProxy, ClientListDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { NewEventComponent } from './new-event/new-event.component';
import { MatBottomSheet } from '@angular/material';
import { ClientBottomSheetComponent } from './client-bottom-sheet/client-bottom-sheet.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { EventEmitter } from 'selenium-webdriver';

declare const $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [BookingServiceProxy, DashBoardServiceProxy, DatePipe]
})
export class DashboardComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild('calendar', { static: false }) calendarComponent: FullCalendarComponent;
  @ViewChild('newEvent', { static: false }) newEventModal: NewEventComponent;
  @ViewChild('editEvent', { static: false }) editEventModal: EditEventComponent;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  bookings: BookingListDto[] = [];
  newEvents: EventInput[] = [];
  NoFiles: number;
  clients: ClientListDto[] = [];
  date = new Date();
  filter = '';
  clientsChanged = false;
  activities: BookingListDto[] = [];
  calendarEvents: EventInput[] = [];
  constructor(private injector: Injector,
    private bookingService: BookingServiceProxy,
    private dashBoardService: DashBoardServiceProxy,
    private datePipe: DatePipe,
    private _bottomSheet: MatBottomSheet) {
    super(injector);
  }

  modifyTitle(eventIndex, newTitle) {
    const calendarEvents = this.calendarEvents.slice(); // a clone
    const singleEvent = Object.assign({}, calendarEvents[eventIndex]); // a clone
    singleEvent.title = newTitle;
    calendarEvents[eventIndex] = singleEvent;
    this.calendarEvents = calendarEvents;
  }
  handleDateClick(arg) {
    this.newEventModal.open(arg);
  }
  handleEventClick(arg) {
    const date = moment(arg.event.start).format('YYYY-MM-DD');
    this.editEventModal.open(date, arg.event.id);
  }
  addBooking(booking: any[]) {
    this.calendarEvents = this.calendarEvents.concat({
      title: booking[1],
      start: moment(booking[0].startTime).format('YYYY-MM-DD HH:mm:ss'),
      end: moment(booking[0].endTime).format('YYYY-MM-DD HH:mm:ss')
    });
    this.getBookings();
  }
  editSelectedEvent(event) {
    this.getBookings();
  }
  ngAfterViewInit(): void {

  }

  getBookings() {
    this.calendarEvents = []; // to avoid duplicates
    this.bookingService.getBookings('')
      .pipe(finalize(() => {
        this.bookings.forEach((el) => {
          let event: EventInput;
          event = {
            title: el.client.firstName + ' ' + el.client.lastName,
            start: moment(el.startTime).format('YYYY-MM-DD HH:mm:ss'),
            end: moment(el.endTime).format('YYYY-MM-DD HH:mm:ss'),
            id: el.id,
            date: moment(el.startTime).format('yyyy-MM-dd'),
            color: this.getEventColor(el.eventId)
          };
          this.calendarEvents.push(event);
        });
      }))
      .subscribe((result) => {
        this.bookings = result.items;
      });
  }
  getNumFiles() {
    this.dashBoardService.getNumberFiles(this.filter).subscribe((result) => {
      this.NoFiles = result;
    });
  }
  getNewClients() {
    this.dashBoardService.getNewClients(this.filter).subscribe((result) => {
      this.clients = result.items;
    });
  }
  getLatestActivity() {
    this.dashBoardService.getLatestActivity(this.filter).subscribe((result) => {
      this.activities = result.items;
    });
  }
  getEventColor(id: number) {
    switch (id) {
      case 1: return '#2962ff';
      case 2: return '#03a9f4';
      case 3: return '#e91e63';
      case 4: return '#ff5722';
      case 5: return '#00e676';
      default: return '#378006';
    }
  }

  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  }
  ngOnInit() {
    this.getBookings();
    this.bookings.forEach((el) => {
      let event: EventInput;
      event = {
        title: el.client.firstName + ' ' + el.client.lastName,
        start: moment(el.startTime).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(el.endTime).format('YYYY-MM-DD HH:mm:ss')
      };
      this.calendarEvents.push(event);
    });

    this.getNumFiles();
    this.getNewClients();
    this.getLatestActivity();

    /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

    const datawebsiteViewsChart = {
      labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      series: [
        [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

      ]
    };
    const optionswebsiteViewsChart = {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 1000,
      chartPadding: { top: 0, right: 5, bottom: 0, left: 0 }
    };
    const responsiveOptions: any[] = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];
    const websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

    // start animation for the Emails Subscription Chart
    this.startAnimationForBarChart(websiteViewsChart);
  }
  renderDay(event) {
    if (event != null) {
      if (this.datePipe.transform(event.date, 'dd-MM-yyyy') ===
      this.datePipe.transform(this.date, 'dd-MM-yyyy'))  {
        event.el.style.background = '#4FC3F7';
      }
    }
  }
  openBottomSheet(event) {
    const bottomSheetRef = this._bottomSheet.open(ClientBottomSheetComponent, {
      data: event,
      hasBackdrop: true,
      autoFocus: true,
      restoreFocus: true,
      closeOnNavigation: false,
      disableClose: true
    });
    bottomSheetRef.afterDismissed().subscribe(() => {
      this.clientsChanged = true;
    });
  }
}

