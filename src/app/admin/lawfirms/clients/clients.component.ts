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
  ReportGripStrength,
  ReportRoMShoulderDto,
  ReportRoMForearmWristDto,
  ReportRoMElbowDto,
  ReportRoMHandDto,
  ReportRoMHipDto,
  ReportRoMKneeDto,
  ReportRoMAnkleDto,
  AssessmentServiceProxy,
  AffectServiceProxy,
  MobilityServiceProxy,
  AffectDto,
  MobilityDto,
} from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { finalize } from 'rxjs/operators';
import { NewClientComponent } from './new-client/new-client.component';
import { DocumentCreator } from '@app/admin/partials/document-creator';
import * as moment from 'moment';
import { GeneralService } from '@app/admin/services/general.service';
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  providers: [ClientServiceProxy, DocumentServiceProxy, ReportServiceProxy,
    MobilityServiceProxy, AffectServiceProxy]
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
  gripStrengthReport: ReportGripStrength; musclePowerReport: string;
  shoulderLeftReport: ReportRoMShoulderDto = new ReportRoMShoulderDto();
  shoulderRightReport: ReportRoMShoulderDto = new ReportRoMShoulderDto();
  forearmWristLeftReport: ReportRoMForearmWristDto = new ReportRoMForearmWristDto();
  forearmWristRightReport: ReportRoMForearmWristDto = new ReportRoMForearmWristDto();
  elbowLeftReport: ReportRoMElbowDto = new ReportRoMElbowDto();
  elbowRightReport: ReportRoMElbowDto = new ReportRoMElbowDto();
  handLeftReport: ReportRoMHandDto = new ReportRoMHandDto();
  handRightReport: ReportRoMHandDto = new ReportRoMHandDto();
  hipLeftReport: ReportRoMHipDto = new ReportRoMHipDto();
  hipRightReport: ReportRoMHipDto = new ReportRoMHipDto();
  kneeLeftReport: ReportRoMKneeDto = new ReportRoMKneeDto();
  kneeRightReport: ReportRoMKneeDto = new ReportRoMKneeDto();
  ankleLeftReport: ReportRoMAnkleDto = new ReportRoMAnkleDto();
  ankleRightReport: ReportRoMAnkleDto = new ReportRoMAnkleDto();
  borgBalanceReport: string; sensation: string; affectComment: string;
  mobilityComment: string; coordinationReport: string; postureReport: string;
  gaitReport: string; walkingReport: string; stairClimbing: string;
  balanceReport: string; ladderWork: string; repetitiveSquatting: string;
  repetitiveFootMotionReport: string; crawlingReport: string;

  assessmentReport: any[] = [];
  rangeOfMotionReport: any[] = [];
  comment: string;
  affect: AffectDto = new AffectDto();
  mobility: MobilityDto = new MobilityDto();

  constructor(injector: Injector,
    private clientService: ClientServiceProxy,
    private documentService: DocumentServiceProxy,
    private _reportService: ReportServiceProxy,
    private _generalService: GeneralService,
    private _affectService: AffectServiceProxy,
    private _mobilityService: MobilityServiceProxy,
    private _assessmentService: AssessmentServiceProxy) {
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
  generate(client) {
    let entity: ClientDetailOutput = new ClientDetailOutput();
    this.clientService.getDetail(client.id).pipe(finalize(() => {

    })).subscribe((result) => {
      entity = result;
    });
    this.isGenerating = true;
    this.getMedicalHistory(client.id);
    this.getWorkHistory(client.id);
    this.getClientHistory(client.id);
    this.getFileData(client.id);
    this.lawFirmCity = 'Port Elizabeth';
    const address: CreateAddressInput = new CreateAddressInput();
    this.clientService.getDetail(client.id)
      .pipe(finalize(() => {
        this.clientService.getMedicalHistoryByClientId(client.id)
          .pipe(finalize(() => { }))
          .subscribe((result) => {
            this.medicalData = result;
          });
        this.clientService.getWorkHistoryByClientId(client.id)
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
    const age = this._generalService.getAge('' + client.idNumber);
    const gender = this._generalService.getGender('' + client.idNumber);
    this.getReportData(client.id, age, gender);
    const docCreator = new DocumentCreator();
    setTimeout(() => {
      const today = moment().format('LL');
      docCreator.generateDoc([entity, address, this.filteredDocuments, this.medicalData,
        this.workData, this.lawFirmCity, this.assessmentReport, this.rangeOfMotionReport], today);
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

  getReportData(clientId: string, age: number, gender: number) {
    this.getGripStrength(clientId, age, gender);
    this.getMusclePower(clientId);
    this.getShoulders(clientId);
    this.getForearmWrist(clientId);
    this.getElbow(clientId);
    this.getHand(clientId);
    this.getHip(clientId);
    this.getKnee(clientId);
    this.getAnkle(clientId);
    this.getBorgBalance(clientId);
    this.getSensation(clientId);
    this.getMobility(clientId);
    this.getAffect(clientId);
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
  getGripStrength(clientId: string, age: number, gender: number) {
    this._reportService.getGripStrengthReport(clientId, age, gender)
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
    this._reportService.getRoMShoulderReport(clientId, 0)
      .subscribe((result) => {
        this.shoulderLeftReport = result;
        this.rangeOfMotionReport[0] = result;
      });

    this._reportService.getRoMShoulderReport(clientId, 1)
      .subscribe((result) => {
        this.shoulderRightReport = result;
        this.rangeOfMotionReport[1] = result;
      });
  }
  getForearmWrist(clientId: string) {
    this._reportService.getRoMForearmWristReport(clientId, 0)
      .subscribe((result) => {
        this.forearmWristLeftReport = result;
        this.rangeOfMotionReport[2] = result;
      });
    this._reportService.getRoMForearmWristReport(clientId, 1)
      .subscribe((result) => {
        this.forearmWristRightReport = result;
        this.rangeOfMotionReport[3] = result;
      });
  }
  getElbow(clientId: string) {
    this._reportService.getRoMElbowReport(clientId, 0)
      .subscribe((result) => {
        this.elbowLeftReport = result;
        this.rangeOfMotionReport[4] = result;
      });
    this._reportService.getRoMElbowReport(clientId, 1)
      .subscribe((result) => {
        this.elbowRightReport = result;
        this.rangeOfMotionReport[5] = result;
      });
  }
  getHand(clientId: string) {
    this._reportService.getRoMHandReport(clientId, 0)
      .subscribe((result) => {
        this.handLeftReport = result;
        this.rangeOfMotionReport[6] = result;
      });

    this._reportService.getRoMHandReport(clientId, 1)
      .subscribe((result) => {
        this.handRightReport = result;
        this.rangeOfMotionReport[7] = result;
      });
  }

  getHip(clientId: string) {
    this._reportService.getRoMHipReport(clientId, 0)
      .subscribe((result) => {
        this.hipLeftReport = result;
        this.rangeOfMotionReport[8] = result;
      });
    this._reportService.getRoMHipReport(clientId, 1)
      .subscribe((result) => {
        this.hipRightReport = result;
        this.rangeOfMotionReport[9] = result;
      });
  }

  getKnee(clientId: string) {
    this._reportService.getRoMKneeReport(clientId, 0)
      .subscribe((result) => {
        this.kneeLeftReport = result;
        this.rangeOfMotionReport[10] = result;
      });
    this._reportService.getRoMKneeReport(clientId, 1)
      .subscribe((result) => {
        this.kneeRightReport = result;
        this.rangeOfMotionReport[11] = result;
      });
  }

  getAnkle(clientId: string) {
    this._reportService.getRoMAnkleReport(clientId, 0)
      .subscribe((result) => {
        this.ankleLeftReport = result;
        this.rangeOfMotionReport[12] = result;
      });
    this._reportService.getRoMAnkleReport(clientId, 1)
      .subscribe((result) => {
        this.ankleRightReport = result;
        this.rangeOfMotionReport[13] = result;
      });
  }

  getBorgBalance(clientId: string) {
    this._reportService.getBorgBalanceReport(clientId)
      .subscribe((result) => {
        this.borgBalanceReport = result;
        this.assessmentReport[9] = result;
      });
  }

  getSensation(clientId: string) {
    this._assessmentService.getSensation(clientId)
      .pipe(finalize(() => {
      }))
      .subscribe(
        (sensation) => {
          this.comment = sensation.otComment;
          this.assessmentReport[10] = this.comment;
        }
      );
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
  getMobility(clientId: string) {
    this._mobilityService.getByClientAsync(clientId)
      .pipe(finalize(() => {
      }))
      .subscribe(
        (result) => {
          this.mobility = result;
          this.mobilityComment = result.comment;
          this.assessmentReport[11] = result.comment;
        }
      );
  }
  getAffect(clientId: string) {
    this._affectService.getByClientAsync(clientId)
      .pipe(finalize(() => {
      })).subscribe(
        (affect) => {
          this.affect = affect;
          this.affectComment = affect.comment;
          this.assessmentReport[12] = affect.comment;
        }
      );
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
