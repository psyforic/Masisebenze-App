import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingServiceProxy, ClientServiceProxy, ClientDetailOutput, BookingListDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-view-activity-log',
  templateUrl: './view-activity-log.component.html',
  styleUrls: ['./view-activity-log.component.scss'],
  providers: [ClientServiceProxy, BookingServiceProxy]
})
export class ViewActivityLogComponent implements OnInit {
  tomorrow = new Date(2017, 9, 20, 14, 34);
  clientId: string;
  activities: BookingListDto[] = [];
  client: ClientDetailOutput = new ClientDetailOutput();
  constructor(private route: ActivatedRoute,
    private bookingService: BookingServiceProxy,
    private clientService: ClientServiceProxy) {
    this.route.paramMap.subscribe((paramMap) => {
      this.clientId = paramMap.get('id');
    });
  }

  ngOnInit() {
    this.getClient();
    this.getActivities();
  }
  getClient() {
    this.clientService.getDetail(this.clientId)
      .subscribe((result) => {
        this.client = result;
      });
  }
  getActivities() {
    this.bookingService.getUserBookings(this.clientId)
      .subscribe((result) => {
        this.activities = result.items;
      });
  }
}
