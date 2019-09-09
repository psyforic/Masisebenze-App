import { Component, OnInit, Injector, ViewChild, AfterViewInit } from '@angular/core';
import * as Chartist from 'chartist';
import { AppComponentBase } from '@shared/app-component-base';
import dayGridPlugin from '@fullcalendar/daygrid';
import { NewBookingComponent } from './bookings/new-booking/new-booking.component';
import { FullCalendarComponent } from '@fullcalendar/angular';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { BookingServiceProxy, BookingListDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [BookingServiceProxy]
})
export class DashboardComponent extends AppComponentBase implements OnInit, AfterViewInit {
  @ViewChild('newBooking', { static: false }) newBookingModal: NewBookingComponent;
  @ViewChild('calendar', { static: false }) calendarComponent: FullCalendarComponent;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  bookings: BookingListDto[] = [];
  newEvents: EventInput[] = [];
  calendarEvents: EventInput[] = [
    { title: 'Event Now', start: new Date() }
  ];
  constructor(private injector: Injector, private bookingService: BookingServiceProxy) {
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
    this.newBookingModal.open(arg);
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
            start: moment(el.assessmentTime).format('YYYY-MM-DD HH:mm:ss')
          };
          this.calendarEvents.push(event);
        });
        console.log(this.bookings);
      }))
      .subscribe((result) => {
        this.bookings = result.items;

      });
  }

  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
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
        start: moment(el.assessmentTime).format('YYYY-MM-DD HH:mm:ss')
      };
      this.calendarEvents.push(event);
    });
    /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

    const dataDailySalesChart: any = {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      series: [
        [12, 17, 7, 17, 23, 18, 38]
      ]
    };

    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    };

    const dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

    this.startAnimationForLineChart(dailySalesChart);


    /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

    const dataCompletedTasksChart: any = {
      labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
      series: [
        [230, 750, 450, 300, 280, 240, 200, 190]
      ]
    };

    const optionsCompletedTasksChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
    };

    const completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

    // start animation for the Completed Tasks Chart - Line Chart
    this.startAnimationForLineChart(completedTasksChart);



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

