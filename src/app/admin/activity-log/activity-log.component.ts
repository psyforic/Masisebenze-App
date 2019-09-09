import { Component, OnInit, Injector } from '@angular/core';
import { ClientServiceProxy, ClientListDto, AttorneyListDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss'],
  providers: [ClientServiceProxy]
})
export class ActivityLogComponent extends PagedListingComponentBase<ClientListDto> {

  displayedColumns = ['client', 'lastModified', 'status'];
  dataSource: MatTableDataSource<ClientListDto>;
  clients: ClientListDto[] = [];
  constructor(private injector: Injector,
    private clientService: ClientServiceProxy) {
    super(injector);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.clientService.getAll(request.sorting, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => {
        finishedCallback();
      })).subscribe((result) => {
        this.clients = result.items;
        this.dataSource = new MatTableDataSource(this.clients);
      });
  }
  delete(entity: ClientListDto): void {
    throw new Error('Method not implemented.');
  }

}
