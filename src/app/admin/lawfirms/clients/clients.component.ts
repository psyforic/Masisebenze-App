import { Component, ViewChild, Injector } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
// import { NewClientComponent } from '../lawfirms/new-client/new-client.component';
import {
  ClientListDto,
  ClientServiceProxy,
  WorkHistoryListDto,
  MedicalHistoryListDto,
  CreateAddressInput,
  MedicalHistoryDetailOutput,
  WorkHistoryDetailOutput
} from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { ReportGenerator } from '@app/admin/partials/report-generator';
import { Packer } from 'docx';
// import { saveAs } from 'file-saver/FileSaver';
import { saveAs } from 'file-saver';
import { NewClientComponent } from './new-client/new-client.component';
import { DocumentCreator } from '@app/admin/partials/document-creator';
import * as moment from 'moment';

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
  client: ClientListDto = new ClientListDto();
  workData: WorkHistoryListDto = new WorkHistoryListDto();
  medicalData: MedicalHistoryListDto = new MedicalHistoryListDto();
  isSaving = false;
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
    this.isSaving = true;
    this.getMedicalHistory(entity.id);
    this.getWorkHistory(entity.id);
    this.getClientHistory(entity.id);
    const address: CreateAddressInput = new CreateAddressInput();
    // const medicalHistory: MedicalHistoryDetailOutput = new MedicalHistoryDetailOutput();
    // const workHistory: WorkHistoryDetailOutput = new WorkHistoryDetailOutput();

    this.clientService.getDetail(entity.id)
      .pipe(finalize(() => {
        this.clientService.getMedicalHistoryByClientId(entity.id)
          .pipe(finalize(() => {
            const docCreator = new DocumentCreator();
            setTimeout(() => {
              const today = moment().format('LL');
              docCreator.generateDoc([entity, address, this.medicalData, this.workData], today);
              console.log('Document created successfully');
              this.isSaving = false;
            }, 5000);
          }))
          .subscribe((result) => {
            this.medicalData = result;
            console.log(this.medicalData);
          });
        this.clientService.getWorkHistoryByClientId(entity.id)
          .subscribe((result) => {
            this.workData = result;
            console.log(this.workData);
          });
      }))
      .subscribe((result) => {
        address.line1 = result.address.line1;
        address.line2 = result.address.line2;
        address.city = result.address.city;
        address.postalCode = result.address.postalCode;
        address.province = result.address.province;
        console.log(result.address);

      });

  }
  getMedicalHistory(id) {
    this.clientService.getMedicalHistoryByClientId(id)
      .pipe(finalize(() => {
      }))
      .subscribe((result) => {
        this.medicalData = result;
        console.log(result);
      });
  }
  getWorkHistory(id) {
    this.clientService.getWorkHistoryByClientId(id)
      .pipe(finalize(() => {

      }))
      .subscribe((result) => {
        this.workData = result;
      });
  }
  getClientHistory(id) {
    this.clientService.getById(id)
      .subscribe((result) => {
        this.client = result;
      });
  }

  // getDob() {
  //   const tempDate = new Date(clientData.idNumber.substring(0, 2), clientData.substring(2, 4) - 1, clientData.substring(4, 6));
  //   const id_date = tempDate.getDate();
  //   const id_month = tempDate.getMonth();
  //   const id_year = tempDate.getFullYear();
  //   const fullDate = id_date + '-' + (id_month + 1) + '-' + id_year;

  //   return fullDate;
  // }
  // getAge() {
  //   const tempDate = new Date(clientData.idNumber.substring(0, 2), clientData.substring(2, 4) - 1, clientData.substring(4, 6));
  //   const id_date = tempDate.getDate();
  //   const id_month = tempDate.getMonth();
  //   const id_year = tempDate.getFullYear();
  //   const fullDate = id_date + '-' + (id_month + 1) + '-' + id_year;
  //   let currentAge = new Date().getFullYear() - id_year;
  //   if (id_month > new Date().getMonth()) {
  //     currentAge = currentAge - 1;
  //   }

  //   return currentAge;
  // }
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
