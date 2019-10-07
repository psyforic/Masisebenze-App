import { Component, ViewChild, Injector } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { NewAttorneyComponent } from './new-attorney/new-attorney.component';
import { EditAttorneyComponent } from './edit-attorney/edit-attorney.component';
import { AttorneyListDto, AttorneyServiceProxy } from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { ViewAttorneyComponent } from './view-attorney/view-attorney.component';


@Component({
  selector: 'app-attorneys',
  templateUrl: './attorneys.component.html',
  styleUrls: ['./attorneys.component.scss'],
  providers: [AttorneyServiceProxy]
})
export class AttorneysComponent extends PagedListingComponentBase<AttorneyListDto> {
  dataSource: MatTableDataSource<AttorneyListDto> = new MatTableDataSource<AttorneyListDto>();
  displayedColumns = ['firstName', 'lastName', 'email', 'phone', 'lawFirm', 'actions'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('newAttorney', { static: true }) newAttorney: NewAttorneyComponent;
  @ViewChild('editAttorney', { static: true }) editAttorney: EditAttorneyComponent;
  @ViewChild('viewAttorney', { static: true }) viewAttorney: ViewAttorneyComponent;
  attorneys: AttorneyListDto[] = [];
  constructor(private injector: Injector,
    private attorneyService: AttorneyServiceProxy) {
    super(injector);
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  createNewAttorney() {
    this.newAttorney.open();
  }
  editSelectedAttorney(id: string) {
    this.editAttorney.open(id);
  }
  viewSelectedAttorney(id: string) {
    this.viewAttorney.open(id);
  }
  handleChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.totalItems = event.length;
    this.getDataPage(event.pageIndex + 1);
  }
  list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.attorneyService.getAll(request.sorting, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => {
        finishedCallback();
      })).subscribe((result) => {
        this.attorneys = result.items;
        this.showPaging(result, pageNumber);
        this.dataSource.data = this.attorneys;
        this.dataSource.sort = this.sort;
      });
  }
  protected delete(entity: AttorneyListDto): void {
    abp.message.confirm(
      'Delete Attorney \'' + entity.firstName + ' ' + entity.lastName + '\'?',
      (result: boolean) => {
        if (result) {
          this.attorneyService.delete(entity.id).pipe(finalize(() => {
            abp.notify.success('Deleted Attorney: ' + entity.firstName + ' ' + entity.lastName);
            this.refresh();
          })).subscribe(() => { });
        }
      }
    );
  }
}
