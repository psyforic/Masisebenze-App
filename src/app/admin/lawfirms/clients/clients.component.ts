import { Component, ViewChild, Injector } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import {
  ClientListDto,
  ClientServiceProxy,
  WorkHistoryListDto,
  MedicalHistoryListDto,
  CreateAddressInput,
  DocumentServiceProxy,
  DocumentListDto,
  WorkHistoryDetailOutput,
  ClientDetailOutput,
  ReportServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { NewClientComponent } from './new-client/new-client.component';
import { DocumentCreator } from '@app/admin/partials/document-creator';
import * as moment from 'moment';
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  providers: [ClientServiceProxy, DocumentServiceProxy, ReportServiceProxy]
})
export class ClientsComponent extends PagedListingComponentBase<ClientListDto>  {

  @ViewChild('newClient', { static: false }) newClientRef: NewClientComponent;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  dataSource: MatTableDataSource<ClientListDto>;
  displayedColumns = ['firstName', 'lastName', 'dob', 'age', 'dateOfInjury', 'actions'];
  clients: ClientListDto[] = []; client: ClientListDto;
  workData: WorkHistoryListDto = new WorkHistoryDetailOutput();
  medicalData: MedicalHistoryListDto = new MedicalHistoryListDto();
  isSaving = false; isGenerating = false; documents: DocumentListDto[] = [];
  filteredDocuments; lawFirmCity: string;
  gripStrengthReport: string; musclePowerReport: string; shouldersReport: string;
  forearmWristReport: string; elbowReport: string; handReport: string;
  hipReport: string; kneeReport: string; ankleReport: string;
  borgBalanceReport: string; sensationUpperReport: string; sensationLowerReport: string;
  sensationTrunkReport: string; coordinationReport: string; postureReport: string;
  gaitReport: string; walkingReport: string; stairClimbing: string;
  balanceReport: string; ladderWork: string; repetitiveSquatting: string;
  repetitiveFootMotionReport: string; crawlingReport: string;

  assessmentReport: string[] = [];

  constructor(injector: Injector,
    private clientService: ClientServiceProxy,
    private documentService: DocumentServiceProxy,
    private _reportService: ReportServiceProxy) {
    super(injector);
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
  createClient() {
    this.newClientRef.open();
  }
  generate(clientId: string) {
    let entity: ClientDetailOutput = new ClientDetailOutput();
    this.clientService.getDetail(clientId).pipe(finalize(() => {

    })).subscribe((result) => {
      entity = result;
    });
    this.isGenerating = true;
    this.getMedicalHistory(clientId);
    this.getWorkHistory(clientId);
    this.getClientHistory(clientId);
    this.getFileData(clientId);
    this.lawFirmCity = 'Port Elizabeth';
    const address: CreateAddressInput = new CreateAddressInput();
    this.clientService.getDetail(clientId)
      .pipe(finalize(() => {
        this.clientService.getMedicalHistoryByClientId(clientId)
          .pipe(finalize(() => { }))
          .subscribe((result) => {
            this.medicalData = result;
          });
        this.clientService.getWorkHistoryByClientId(clientId)
          .subscribe((result) => {
            this.workData = result;
          });
      }))
      .subscribe((result) => {
        address.line1 = result.address.line1;
        address.line2 = result.address.line2;
        address.city = result.address.city;
        address.postalCode = result.address.postalCode;
        address.province = result.address.province;
      });
    this.getReportData(clientId);
    const docCreator = new DocumentCreator();
    setTimeout(() => {
      const today = moment().format('LL');
      console.log(this.assessmentReport);
      docCreator.generateDoc([entity, address, this.filteredDocuments, this.medicalData,
        this.workData, this.lawFirmCity, this.assessmentReport], today);
      this.notify.success('Document created successfully');
    }, 15000);
  }
  getMedicalHistory(id) {
    this.clientService.getMedicalHistoryByClientId(id)
      .pipe(finalize(() => {
      }))
      .subscribe((result) => {
        this.medicalData = result;
      });
  }
  getFileData(id) {
    this.documentService.getClientDocuments(id)
      .pipe(finalize(() => { }))
      .subscribe((result) => {
        this.documents = result.items;
        const filtered = this.documents.map((value) => {
          return { date_authored: moment(value.authorDate).format('DD/MM/YYYY'), file_name: value.name, author_name: value.authorName };
        });
        this.filteredDocuments = filtered;
      });
  }
  getWorkHistory(id) {
    this.clientService.getWorkHistoryByClientId(id)
      .pipe(finalize(() => { }))
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
  getAge(entity: ClientListDto) {
    const idNumber: string = '' + entity.idNumber;
    const tempDate = new Date(
      +idNumber.substr(0, 2),
      +(idNumber.substring(2, 4)) - 1,
      +idNumber.substring(4, 6));
    const id_month = tempDate.getMonth();
    const id_year = tempDate.getFullYear();
    let currentAge = new Date().getFullYear() - id_year;
    if (id_month > new Date().getMonth()) {
      currentAge = currentAge - 1;
    } else if (id_month === new Date().getMonth() && tempDate.getDate() < new Date().getDate()) {
      currentAge = currentAge - 1;
    }
    return currentAge;
  }

  getDob(entity: ClientListDto) {
    const idNumber: string = '' + entity.idNumber;
    const tempDate = new Date(
      +idNumber.substr(0, 2),
      +(idNumber.substring(2, 4)) - 1,
      +idNumber.substring(4, 6));
    const fullDate = moment(tempDate).format('DD/MM/YYYY');
    return fullDate;
  }
  handleChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.totalItems = event.length;
    this.getDataPage(event.pageIndex + 1);
  }

  getReportData(clientId: string) {
    this.getGripStrength(clientId);
    this.getMusclePower(clientId);
    this.getShoulders(clientId);
    this.getForearmWrist(clientId);
    this.getElbow(clientId);
    this.getHand(clientId);
    this.getHip(clientId);
    this.getKnee(clientId);
    this.getAnkle(clientId);
    this.getBorgBalance(clientId);
    this.getSensationUpper(clientId);
    this.getSensationTrunk(clientId);
    this.getSensationLower(clientId);
    this.getCoordination(clientId);
    this.getPosture(clientId);
    this.getGait(clientId);
    this.getWalking(clientId);
    this.getStairClimbing(clientId);
    this.getBalance(clientId);
    this.getLadderWork(clientId);
    this.getRepetitiveSquatting(clientId);
    this.getRepetitiveFootMotion(clientId);
    this.getCrawling(clientId);
  }
  getGripStrength(clientId: string) {
    this._reportService.getGripStrengthReport(clientId)
      .subscribe((result) => {
        this.gripStrengthReport = result;
        this.assessmentReport[0] = result;
      });
  }
  getMusclePower(clientId: string) {
    this._reportService.getMusclePowerReport(clientId)
      .subscribe((result) => {
        this.musclePowerReport = result;
        this.assessmentReport[1] = result;
      });
  }
  getShoulders(clientId: string) {
    this._reportService.getRoMShoulderReport(clientId)
      .subscribe((result) => {
        this.shouldersReport = result;
        this.assessmentReport[2] = result;
      });
  }
  getForearmWrist(clientId: string) {
    this._reportService.getRoMForearmWristReport(clientId)
      .subscribe((result) => {
        this.forearmWristReport = result;
        this.assessmentReport[3] = result;
      });
  }
  getElbow(clientId: string) {
    this._reportService.getRoMElbowReport(clientId)
      .subscribe((result) => {
        this.elbowReport = result;
        this.assessmentReport[4] = result;
      });
  }
  getHand(clientId: string) {
    this._reportService.getRoMHandReport(clientId)
      .subscribe((result) => {
        this.handReport = result;
        this.assessmentReport[5] = result;
      });
  }

  getHip(clientId: string) {
    this._reportService.getRoMHipReport(clientId)
      .subscribe((result) => {
        this.hipReport = result;
        this.assessmentReport[6] = result;
      });
  }

  getKnee(clientId: string) {
    this._reportService.getRoMKneeReport(clientId)
      .subscribe((result) => {
        this.kneeReport = result;
        this.assessmentReport[7] = result;
      });
  }

  getAnkle(clientId: string) {
    this._reportService.getRoMAnkleReport(clientId)
      .subscribe((result) => {
        this.ankleReport = result;
        this.assessmentReport[8] = result;
      });
  }

  getBorgBalance(clientId: string) {
    this._reportService.getBorgBalanceReport(clientId)
      .subscribe((result) => {
        this.borgBalanceReport = result;
        this.assessmentReport[9] = result;
      });
  }

  getSensationUpper(clientId: string) {
    this._reportService.getSensationUpperReport(clientId)
      .subscribe((result) => {
        this.sensationUpperReport = result;
        this.assessmentReport[10] = result;
      });
  }

  getSensationTrunk(clientId: string) {
    this._reportService.getSensationTrunkReport(clientId)
      .subscribe((result) => {
        this.sensationTrunkReport = result;
        this.assessmentReport[11] = result;
      });
  }

  getSensationLower(clientId: string) {
    this._reportService.getSensationLowerReport(clientId)
      .subscribe((result) => {
        this.sensationLowerReport = result;
        this.assessmentReport[12] = result;
      });
  }

  getCoordination(clientId: string) {
    this._reportService.getCoordinationReport(clientId)
      .subscribe((result) => {
        this.coordinationReport = result;
        this.assessmentReport[13] = result;
      });
  }

  getPosture(clientId: string) {
    this._reportService.getPostureReport(clientId)
      .subscribe((result) => {
        this.postureReport = result;
        this.assessmentReport[14] = result;
      });
  }

  getGait(clientId: string) {
    this._reportService.getGaitReport(clientId)
      .subscribe((result) => {
        this.gaitReport = result;
        this.assessmentReport[15] = result;
      });
  }

  getWalking(clientId: string) {
    this._reportService.getWalkingProtocolReport(clientId)
      .subscribe((result) => {
        this.walkingReport = result;
        this.assessmentReport[16] = result;
      });
  }
  getStairClimbing(clientId: string) {
    this._reportService.getStairClimbingProtocolReport(clientId)
      .subscribe((result) => {
        this.stairClimbing = result;
        this.assessmentReport[17] = result;
      });
  }
  getBalance(clientId: string) {
    this._reportService.getBalanceProtocolReport(clientId)
      .subscribe((result) => {
        this.balanceReport = result;
        this.assessmentReport[18] = result;
      });
  }

  getLadderWork(clientId: string) {
    this._reportService.getLadderWorkProtocolReport(clientId)
      .subscribe((result) => {
        this.ladderWork = result;
        this.assessmentReport[19] = result;
      });
  }

  getRepetitiveSquatting(clientId: string) {
    this._reportService.getRepetitiveSquattingProtocolReport(clientId)
      .subscribe((result) => {
        this.repetitiveSquatting = result;
        this.assessmentReport[20] = result;
      });
  }

  getRepetitiveFootMotion(clientId: string) {
    this._reportService.getRepetitiveFootMotionProtocolReport(clientId)
      .subscribe((result) => {
        this.repetitiveFootMotionReport = result;
        this.assessmentReport[21] = result;
      });
  }
  getCrawling(clientId: string) {
    this._reportService.getCrawlingProtocolReport(clientId)
      .pipe(finalize(() => {
        this.isGenerating = false;
      }))
      .subscribe((result) => {
        this.crawlingReport = result;
        this.assessmentReport[22] = result;
      });
  }
  protected list(request: PagedRequestDto, pageNumber: number, finishedCallback: Function): void {
    this.clientService.getAll(request.sorting, request.skipCount, request.maxResultCount)
      .pipe(finalize(() => {
        finishedCallback();
      }))
      .subscribe((result) => {
        this.clients = result.items;
        this.showPaging(result, pageNumber);
        this.dataSource = new MatTableDataSource(this.clients);
        this.dataSource.sort = this.sort;
      });
  }
  protected delete(entity: ClientListDto): void {
    abp.message.confirm(
      'Delete Client \'' + entity.firstName + ' ' + entity.lastName + '\'?',
      (result: boolean) => {
        if (result) {
          this.isSaving = true;
          this.clientService.delete(entity.id).pipe(finalize(() => {
            this.isSaving = false;
            abp.notify.success('Deleted Client: ' + entity.firstName + ' ' + entity.lastName);
            this.refresh();
          })).subscribe(() => { });
        } else {
          this.isSaving = false;
        }
      }
    );
  }
}
