import { Component, OnInit, Injector, ViewChild, AfterViewInit } from '@angular/core';
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
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [BookingServiceProxy, DashBoardServiceProxy]
})
export class DashboardComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild('calendar', { static: false }) calendarComponent: FullCalendarComponent;
  @ViewChild('newEvent', { static: false }) newEventModal: NewEventComponent;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  bookings: BookingListDto[] = [];
  newEvents: EventInput[] = [];
  NoFiles: number;
  clients: ClientListDto[] = [];
  filter = '';
  activities: BookingListDto[] = [];
  calendarEvents: EventInput[] = [];
  constructor(private injector: Injector,
    private bookingService: BookingServiceProxy,
    private dashBoardService: DashBoardServiceProxy) {
    super(injector);
  }
  addEvent() {
    this.calendarEvents.push({
      title: 'Assessment 2', start: '2019-09-27'
    });
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
  addBooking(booking: any[]) {
    this.calendarEvents = this.calendarEvents.concat({
      title: booking[1],
      start: moment(booking[0].assessmentTime).format('YYYY-MM-DD HH:mm:ss')
    });
  }
  ngAfterViewInit(): void {
  }

  getBookings() {
    this.bookingService.getBookings('')
      .pipe(finalize(() => {
        this.bookings.forEach((el) => {
          let event: EventInput;
          event = {
            title: el.client.firstName + ' ' + el.client.lastName,
            start: moment(el.startTime).format('YYYY-MM-DD HH:mm:ss'),
            end: moment(el.endTime).format('YYYY-MM-DD HH:mm:ss')
          };
          this.calendarEvents.push(event);
        });
      }))
      .subscribe((result) => {
        this.bookings = result.items;
        console.log(this.bookings);
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

}

