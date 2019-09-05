import { Component, OnInit, ViewChild, AfterViewInit, Injector } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { EditJobDescriptionComponent } from './edit-job-description/edit-job-description.component';
import { NewJobDescriptionComponent } from './new-job-description/new-job-description.component';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { JobDescriptionListDto, JobDescriptionServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-job-descriptions',
  templateUrl: './job-descriptions.component.html',
  styleUrls: ['./job-descriptions.component.scss'],
  providers: [JobDescriptionServiceProxy]
})
export class JobDescriptionsComponent extends PagedListingComponentBase<JobDescriptionListDto> implements AfterViewInit {

  dataSource: MatTableDataSource<JobDescriptionListDto>;
  displayedColumns = ['id', 'name', 'actions'];
  jobDescriptions: JobDescriptionListDto[] = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('editJob', { static: false }) editJob: EditJobDescriptionComponent;
  @ViewChild('newJob', { static: false }) newJob: NewJobDescriptionComponent;
  constructor(private injector: Injector,
    private jobDescriptionService: JobDescriptionServiceProxy) {
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
  editJobTitle(id: number) {
    this.editJob.open(id);
  }
  newJobTitle() {
    this.newJob.open();
  }
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.jobDescriptionService.getAll(request.sorting, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => {
        finishedCallback();
      })).subscribe((result) => {
        this.jobDescriptions = result.items;
        this.dataSource = new MatTableDataSource(this.jobDescriptions);
        this.showPaging(result, pageNumber);
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
