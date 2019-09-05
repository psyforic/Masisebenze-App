import { Component, OnInit, ViewChild, AfterViewInit, Injector } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NewAttorneyComponent } from './new-attorney/new-attorney.component';
import { EditAttorneyComponent } from './edit-attorney/edit-attorney.component';
import { Router } from '@angular/router';
import { AttorneyListDto, AttorneyServiceProxy } from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-attorneys',
  templateUrl: './attorneys.component.html',
  styleUrls: ['./attorneys.component.scss'],
  providers: [AttorneyServiceProxy]
})
export class AttorneysComponent extends PagedListingComponentBase<AttorneyListDto> implements AfterViewInit {
  dataSource: MatTableDataSource<AttorneyListDto>;
  displayedColumns = ['firstName', 'lastName', 'email', 'phone', 'lawFirm', 'actions'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('newAttorney', { static: true }) newAttorney: NewAttorneyComponent;
  @ViewChild('editAttorney', { static: true }) editAttorney: EditAttorneyComponent;

  attorneys: AttorneyListDto[] = [];
  constructor(private injector: Injector,
    private router: Router,
    private attorneyService: AttorneyServiceProxy) {
    super(injector);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  createNewAttorney() {
    this.newAttorney.open();
  }
  editSelectedAttorney() {
    this.editAttorney.open();
  }
  list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.attorneyService.getAll(request.sorting, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => {
        finishedCallback();
      })).subscribe((result) => {
        this.attorneys = result.items;
        this.dataSource = new MatTableDataSource(this.attorneys);
        this.showPaging(result, pageNumber);
      });
  }
  protected delete(entity: AttorneyListDto): void {
    abp.message.confirm(
      'Delete Company \'' + entity.firstName + '\'?',
      (result: boolean) => {
        if (result) {
          this.attorneyService.delete(entity.id).pipe(finalize(() => {
            abp.notify.success('Deleted Law Firm: ' + entity.firstName);
            this.refresh();
          })).subscribe(() => { });
        }
      }
    );
  }
}
