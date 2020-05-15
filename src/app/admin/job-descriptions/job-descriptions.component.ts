import { TopBarService } from '@app/admin/services/top-bar.service';
import { Component, ViewChild, Injector } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { EditJobDescriptionComponent } from './edit-job-description/edit-job-description.component';
import { NewJobDescriptionComponent } from './new-job-description/new-job-description.component';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { JobDescriptionListDto, JobDescriptionServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-job-descriptions',
  templateUrl: './job-descriptions.component.html',
  styleUrls: ['./job-descriptions.component.scss'],
  providers: [JobDescriptionServiceProxy]
})
export class JobDescriptionsComponent extends PagedListingComponentBase<JobDescriptionListDto> {

  dataSource: MatTableDataSource<JobDescriptionListDto>;
  displayedColumns = ['code', 'name',  'actions'];
  jobDescriptions: JobDescriptionListDto[] = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('editJob', { static: false }) editJob: EditJobDescriptionComponent;
  @ViewChild('newJob', { static: false }) newJob: NewJobDescriptionComponent;
  searchInput: string;
  constructor(injector: Injector,
    private _topBarService: TopBarService,
    private http: HttpClient,
    private jobDescriptionService: JobDescriptionServiceProxy) {
    super(injector);
    this._topBarService.setTitle('Job Descriptions');
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  editJobTitle(id: number) {
    this.editJob.open(id);
  }
  newJobTitle() {
    this.newJob.open();
  }
  handleChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.totalItems = event.length;
    this.getDataPage(event.pageIndex + 1);
  }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
  this.isTableLoading = true;
    this.jobDescriptionService.getAll(request.sorting, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => {
        finishedCallback();
        this.isTableLoading = false;
      })).subscribe((result) => {
        this.jobDescriptions = result.items;
        this.showPaging(result, pageNumber);
        this.dataSource = new MatTableDataSource(this.jobDescriptions);
        this.dataSource.sort = this.sort;

      });
  }
  protected delete(entity: JobDescriptionListDto): void {
    abp.message.confirm(
      'Delete Job Description \'' + entity.title + '\'?',
      (result: boolean) => {
        if (result) {
          this.jobDescriptionService.delete(entity.id).pipe(finalize(() => {
            abp.notify.success('Deleted Job Description: ' + entity.title);
            this.refresh();
          })).subscribe(() => { });
        }
      }
    );
  }

}
