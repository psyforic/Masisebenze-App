import { Component, OnInit, ViewChild, AfterViewInit, Injector } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { NewAttorneyComponent } from '../attorneys/new-attorney/new-attorney.component';
import { EditAttorneyComponent } from '../attorneys/edit-attorney/edit-attorney.component';
import { NewLawfirmComponent } from './new-lawfirm/new-lawfirm.component';
import { EditLawfirmComponent } from './edit-lawfirm/edit-lawfirm.component';
import { AppComponentBase } from '@shared/app-component-base';
import { LawFirmServiceProxy, LawFirmListDto } from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';

export interface User {
  id: number;
  email: string;
  fullName: string;
}
@Component({
  selector: 'app-lawfirms',
  templateUrl: './lawfirms.component.html',
  styleUrls: ['./lawfirms.component.scss'],
  providers: [LawFirmServiceProxy]
})
export class LawfirmsComponent extends PagedListingComponentBase<LawFirmListDto> {

  dataSource: MatTableDataSource<LawFirmListDto>;
  displayedColumns = ['companyName', 'email', 'phone', 'actions'];


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('newLawFirm', { static: true }) newLawFirm: NewLawfirmComponent;
  @ViewChild('editLawFirm', { static: true }) editLawFirm: EditLawfirmComponent;

  lawFirms: LawFirmListDto[] = [];
  constructor(private injector: Injector,
    private router: Router,
    private lawFirmService: LawFirmServiceProxy) {
    super(injector);
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  createNewLawFirm() {
    this.newLawFirm.open();
  }
  editSelectedLawFirm(id: string) {
    this.editLawFirm.open(id);
  }
  list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.isTableLoading = true;
    this.lawFirmService.getAll(request.sorting, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => {
        finishedCallback();
      })).subscribe((result) => {
        this.lawFirms = result.items;
        this.dataSource = new MatTableDataSource(this.lawFirms);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.showPaging(result, pageNumber);
      });

  }
  delete(entity: LawFirmListDto): void {
    abp.message.confirm(
      'Delete Company \'' + entity.companyName + '\'?',
      (result: boolean) => {
        if (result) {
          this.lawFirmService.delete(entity.id).pipe(finalize(() => {
            abp.notify.success('Deleted Law Firm: ' + entity.companyName);
            this.refresh();
          })).subscribe(() => { });
        }
      }
    );
  }

}
