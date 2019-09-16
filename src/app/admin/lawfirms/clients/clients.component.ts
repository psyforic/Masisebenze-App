import { Component, ViewChild, Injector } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
// import { NewClientComponent } from '../lawfirms/new-client/new-client.component';
import {
  ClientListDto,
  ClientServiceProxy,
  WorkHistoryListDto,
  MedicalHistoryListDto
} from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { ReportGenerator } from '@app/admin/partials/report-generator';
import { Packer } from 'docx';
// import { saveAs } from 'file-saver/FileSaver';
import { saveAs } from 'file-saver';
import { NewClientComponent } from './new-client/new-client.component';
import { DocumentCreator } from '@app/admin/partials/document-creator';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  providers: [ClientServiceProxy]
})
export class ClientsComponent extends PagedListingComponentBase<ClientListDto>  {

  @ViewChild('newClient', { static: false }) newClientRef: NewClientComponent;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  dataSource: MatTableDataSource<ClientListDto>;
  displayedColumns = ['firstName', 'lastName', 'dob', 'age', 'dateOfInjury', 'actions'];
  clients: ClientListDto[] = [];
  workData: WorkHistoryListDto = new WorkHistoryListDto();
  medicalData: MedicalHistoryListDto = new MedicalHistoryListDto();
  constructor(private injector: Injector,
    private clientService: ClientServiceProxy) {
    super(injector);
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  createClient() {
    this.newClientRef.open();
  }
  generate(entity: ClientListDto) {
    this.getMedicalHistory(entity.id);
    this.getWorkHistory(entity.id);
    const address = '29  7th Avenue, Newton Park';
    const reportGenerator = new ReportGenerator();
    console.log('WorData', this.workData);
    console.log('MedicalData', this.medicalData);
    this.workData.description = 'Provide';
    this.medicalData.currentHistory = 'Provide';
    const doc = reportGenerator.create([entity, address, this.workData, this.medicalData]);
    const docCreator = new DocumentCreator();
    // Packer.toBlob(doc).then(blob => {
    //   console.log(blob);
    //   saveAs(blob, entity.firstName + '_' + entity.lastName + '.docx');
    //   console.log('Document created successfully');
    // });

    // saveAs(report, entity.firstName + '_' + entity.lastName + '.docx');


    // const blob = docCreator.generate();
    // saveAs(blob, entity.firstName + '_' + entity.lastName + '.docx');
    const today = new Date('dd-mm-yyyy').toString();
    docCreator.generateDoc([entity, this.medicalData, this.workData], today);
    console.log('Document created successfully');

  }
  getMedicalHistory(id) {
    this.clientService.getMedicalHistoryByClientId(id)
      .subscribe((result) => {
        this.medicalData = result;
      });
  }
  getWorkHistory(id) {
    this.clientService.getWorkHistoryByClientId(id)
      .subscribe((result) => {
        this.workData = result;
      });
  }

  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.clientService.getAll(request.sorting, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => {
        finishedCallback();
      }))
      .subscribe((result) => {
        this.clients = result.items;
        this.dataSource = new MatTableDataSource(this.clients);
        this.showPaging(result, pageNumber);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }
  protected delete(entity: ClientListDto): void {
    abp.message.confirm(
      'Delete Client \'' + entity.firstName + ' ' + entity.lastName + '\'?',
      (result: boolean) => {
        if (result) {
          this.clientService.delete(entity.id).pipe(finalize(() => {
            abp.notify.success('Deleted Client: ' + entity.firstName + ' ' + entity.lastName);
            this.refresh();
          })).subscribe(() => { });
        }
      }
    );
  }


}
