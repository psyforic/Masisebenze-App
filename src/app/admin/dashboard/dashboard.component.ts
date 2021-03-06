import { NewClientComponent } from './../lawfirms/clients/new-client/new-client.component';
import { DatePipe } from '@angular/common';
import { Component, OnInit, Injector, ViewChild, AfterViewInit } from '@angular/core';
import * as Chartist from 'chartist';
import { AppComponentBase } from '@shared/app-component-base';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import ChartistTooltip from 'chartist-plugin-tooltip';
import {
  BookingServiceProxy,
  BookingListDto,
  DashBoardServiceProxy,
  ClientListDto
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { NewEventComponent } from './new-event/new-event.component';
import { MatBottomSheet } from '@angular/material';
import { ClientBottomSheetComponent } from './client-bottom-sheet/client-bottom-sheet.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { NewLawfirmComponent } from '../lawfirms/lawfirms/new-lawfirm/new-lawfirm.component';
import { IBarChartOptions } from 'chartist';
import { TopBarService } from '../services/top-bar.service';

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
  @ViewChild('newClient', { static: false }) newClientModal: NewClientComponent;
  @ViewChild('newLawFirm', { static: false }) newLawFirmModal: NewLawfirmComponent;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin];
  bookings: BookingListDto[] = [];
  newEvents: EventInput[] = [];
  NoFiles: number;
  NoLawFirms: number;
  clients: ClientListDto[] = [];
  date = new Date();
  filter = '';
  clientsChanged = false;
  activities: BookingListDto[] = [];
  calendarEvents: EventInput[] = [];
  barGraphData: any[] = [];
  constructor(injector: Injector,
    private bookingService: BookingServiceProxy,
    private dashBoardService: DashBoardServiceProxy,
    private _topBarService: TopBarService,
    private datePipe: DatePipe,
    private _bottomSheet: MatBottomSheet) {
    super(injector);
    this._topBarService.setTitle('Dashboard');
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
  newFile() {
    this.newClientModal.open();
  }
  newLawfirm() {
    this.newLawFirmModal.open();
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
    this.dashBoardService.getNumberFiles(this.filter)
      .subscribe((result) => {
        this.NoFiles = result;
      });
  }
  getNumLawFirms() {
    this.dashBoardService.getNumberLawFirms(this.filter)
      .subscribe((result) => {
        this.NoLawFirms = result;
      });
  }
  getAssessments() {
    this.dashBoardService.getAssessmentStats()
      .pipe(finalize(() => {
        this.renderBarGraph();
      })).subscribe((result) => {
        result.items.map(x => {
          this.barGraphData[x.month] = { meta: 'Assessments', value: x.value };
        });
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
    this.getAssessments();
    this.getNumFiles();
    this.getNumLawFirms();
    this.getNewClients();
    this.getLatestActivity();
  }

  renderBarGraph() {
    const datawebsiteViewsChart = {
      labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      series: [this.barGraphData]
    };
    const optionswebsiteViewsChart: IBarChartOptions = {
      axisX: {
        showGrid: true,
      },
      low: 0,
      high: 60,
      chartPadding: { top: 0, right: 5, bottom: 0, left: 0 },
      plugins: [
        ChartistTooltip({
          defaultOptions: {
            appendToBody: false,
            metaIsHtml: false
          }
        })
      ],
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
    this.startAnimationForBarChart(websiteViewsChart);
  }
  renderDay(event) {
    if (event != null) {
      if (this.datePipe.transform(event.date, 'dd-MM-yyyy') ===
        this.datePipe.transform(this.date, 'dd-MM-yyyy')) {
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

