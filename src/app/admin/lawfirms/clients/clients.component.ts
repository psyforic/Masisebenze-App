import { Router } from '@angular/router';
import { TopBarService } from '@app/admin/services/top-bar.service';
import {
  SensationServiceProxy,
  PostureServiceProxy,
  ClientAssessmentReportServiceProxy,
  ReportSummaryServiceProxy,
  WorkAssessmentReportServiceProxy,
  WorkInformationServiceProxy,
  PositionalToleranceDto,
  WeightedProtocolDto,
  WorkAssessmentServiceProxy,
  RepetitiveToleranceDto
} from './../../../../shared/service-proxies/service-proxies';
import { Component, ViewChild, Injector, OnInit } from '@angular/core';
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
  AffectServiceProxy,
  MobilityServiceProxy,
  AffectDto,
  MobilityDto,
} from '@shared/service-proxies/service-proxies';
import { PagedListingComponentBase, PagedRequestDto } from '@shared/paged-listing-component-base';
import { finalize, catchError } from 'rxjs/operators';
import { NewClientComponent } from './new-client/new-client.component';
import { DocumentCreator } from '@app/admin/partials/document-creator';
import * as moment from 'moment';
import { GeneralService } from '@app/admin/services/general.service';
import { Subject, of } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import { FormControl } from '@angular/forms';
import { AssessmentService } from '@app/admin/services/assessment.service';
export class MaxDataValue {
  elementId: string;
  elementName: string;
  title: string;
  dataValue: number;
  category: number;
}
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
  providers: [
    ClientServiceProxy, WorkAssessmentServiceProxy,
    DocumentServiceProxy, ReportServiceProxy, WorkInformationServiceProxy,
    MobilityServiceProxy, AffectServiceProxy, SensationServiceProxy, PostureServiceProxy,
    ClientAssessmentReportServiceProxy, ReportSummaryServiceProxy, WorkAssessmentReportServiceProxy,
    AssessmentService
  ]
})
export class ClientsComponent extends PagedListingComponentBase<ClientListDto> {

  @ViewChild('newClient', { static: false }) newClientRef: NewClientComponent;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  dataSource: MatTableDataSource<ClientListDto>;
  displayedColumns = ['firstName', 'lastName', 'dob', 'age', 'dateOfInjury', 'actions'];
  clients: ClientListDto[] = [];
  client: ClientListDto;
  workData: WorkHistoryListDto = new WorkHistoryDetailOutput();
  medicalData: MedicalHistoryListDto = new MedicalHistoryListDto();
  isSaving = false; isGenerating = false; documents: DocumentListDto[] = [];
  filteredDocuments; lawFirmCity: string;
  gripStrengthReport: ReportGripStrength;
  musclePowerReport: string;
  shoulderLeftReport: ReportRoMShoulderDto = new ReportRoMShoulderDto();
  shoulderRightReport: ReportRoMShoulderDto = new ReportRoMShoulderDto();
  forearmWristLeftReport: ReportRoMForearmWristDto = new ReportRoMForearmWristDto();
  forearmWristRightReport: ReportRoMForearmWristDto = new ReportRoMForearmWristDto();
  elbowLeftReport: ReportRoMElbowDto = new ReportRoMElbowDto();
  elbowRightReport: ReportRoMElbowDto = new ReportRoMElbowDto();
  handLeftReport: ReportRoMHandDto[] = [];
  handRightReport: ReportRoMHandDto[] = [];
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
  searchTerm$ = new Subject<string>();
  searchTerm: FormControl = new FormControl();
  isSearching = false;
  positionalToleranceResult: PositionalToleranceDto[] = [];
  weightedProtocolResult: WeightedProtocolDto[] = [];
  repetitiveToleranceResult: RepetitiveToleranceDto[] = [];
  maxDataValues: MaxDataValue[] = [];
  ageList: string[] = [];
  jobTitle;
  constructor(injector: Injector,
    private _router: Router,
    private _topBarService: TopBarService,
    private clientService: ClientServiceProxy,
    private _assessmentServ: AssessmentService,
    private documentService: DocumentServiceProxy,
    private _reportService: ReportServiceProxy,
    private _workInformationService: WorkInformationServiceProxy,
    private _workAssessmentService: WorkAssessmentServiceProxy,
    private _assessmentReportService: ClientAssessmentReportServiceProxy,
    private _workAssessmentReportService: WorkAssessmentReportServiceProxy,
    private _reportSummaryService: ReportSummaryServiceProxy,
    private _generalService: GeneralService,
    private _affectService: AffectServiceProxy,
    private _mobilityService: MobilityServiceProxy,
    private _sensationService: SensationServiceProxy,
  ) {
    super(injector);
    this.searchClients();
    this._topBarService.setTitle('Clients');
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
  searchClients() {
    this.searchTerm.valueChanges
      .debounceTime(400)
      .subscribe(data => {
        this.isSearching = true;
        this.clientService.clientSearch(data).pipe(finalize(() => {
          this.isSearching = false;
        }))
          .subscribe(result => {
            this.clients = result.items;
            this.dataSource.data = this.clients;
            this.totalItems = this.clients.length;
            this.pageSize = 5;
          });
      });
  }
  viewFullProfile(client: ClientListDto) {
    this._router.navigate(['/admin/clients/view', client.id])
  }
  createClient() {
    this.newClientRef.open();
  }
  generate(client) {
    let entity: ClientDetailOutput = new ClientDetailOutput();
    this.isGenerating = true;
    this._reportService.getPersonalDetails(client.id).pipe(finalize(() => {
      const age = this._generalService.getAge('' + client.idNumber);
      const gender = this._generalService.getGender('' + client.idNumber);
      this._assessmentReportService.getAssessmentReport(entity.id, gender, age)
        .pipe(finalize(() => {
          const docCreator = new DocumentCreator();
          if (this.positionalToleranceResult != null && this.positionalToleranceResult.length > 0) {
            this.positionalToleranceResult = this.positionalToleranceResult.
              filter(x => x.assessmentName != null && x.assessmentName !== '');
          }
          if (this.weightedProtocolResult != null && this.weightedProtocolResult.length > 0) {
            this.weightedProtocolResult = this.weightedProtocolResult.
              filter(x => x.assessmentName != null && x.assessmentName !== '');
          }
          if (this.repetitiveToleranceResult != null && this.repetitiveToleranceResult.length > 0) {
            this.repetitiveToleranceResult = this.repetitiveToleranceResult.
              filter(x => x.assessmentName != null && x.assessmentName !== '');
          }
          this.getElementNames(this.jobTitle, docCreator, entity);
        }))
        .subscribe((result) => {
          /***************************************************************************************
           * COGNITIVE ASSESSMENT REPORT SECTION
           ****************************************************************************************/
          this.gripStrengthReport = result.reportGripStrength;
          this.assessmentReport[0] = result.reportGripStrength;

          this.musclePowerReport = result.musclePowerReport;
          this.assessmentReport[1] = result.musclePowerReport;
          // SHOULDER
          if (result.reportRoMShoulder != null && result.reportRoMShoulder.length > 0) {
            this.shoulderLeftReport = result.reportRoMShoulder.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[0] = this.shoulderLeftReport;
            this.shoulderRightReport = result.reportRoMShoulder.filter(x => x.side === 1)[0];
            this.rangeOfMotionReport[1] = this.shoulderRightReport;
            this.rangeOfMotionReport[14] = true;
          } else {
            this.rangeOfMotionReport[14] = false;
          }
          // FOREARM AND WRIST
          if (result.reportRoMForearmWrist != null && result.reportRoMForearmWrist.length > 0) {
            this.forearmWristLeftReport = result.reportRoMForearmWrist.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[2] = result.reportRoMForearmWrist.filter(x => x.side === 1)[0];
            this.forearmWristRightReport = result.reportRoMForearmWrist.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[3] = result.reportRoMForearmWrist.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[15] = true;
          } else {
            this.rangeOfMotionReport[15] = false;
          }
          // ELBOW
          if (result.reportRoMElbow != null && result.reportRoMElbow.length > 0) {
            this.elbowLeftReport = result.reportRoMElbow.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[4] = result.reportRoMElbow.filter(x => x.side === 1)[0];
            this.elbowRightReport = result.reportRoMElbow.filter(x => x.side === 1)[0];
            this.rangeOfMotionReport[5] = result.reportRoMElbow.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[16] = true;
          } else {
            this.rangeOfMotionReport[16] = false;
          }
          // HAND
          if (result.reportRoMHand != null && result.reportRoMHand.length > 0) {
            this.handLeftReport = result.reportRoMHand.filter(x => x.side === 0);
            this.handRightReport = result.reportRoMHand.filter(x => x.side === 1);
            this.rangeOfMotionReport[6] = this.handLeftReport;
            this.rangeOfMotionReport[7] = this.handRightReport;
            this.rangeOfMotionReport[17] = true;
          } else {
            this.rangeOfMotionReport[17] = false;
          }
          // HIP
          if (result.reportRoMHip != null && result.reportRoMHip.length > 0) {
            this.hipLeftReport = result.reportRoMHip.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[8] = result.reportRoMHip.filter(x => x.side === 1)[0];
            this.hipRightReport = result.reportRoMHip.filter(x => x.side === 1)[0];
            this.rangeOfMotionReport[9] = result.reportRoMHip.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[18] = true;
          } else {
            this.rangeOfMotionReport[18] = false;
          }
          // KNEE
          if (result.reportRoMKnee != null && result.reportRoMKnee.length > 0) {
            this.kneeLeftReport = result.reportRoMKnee.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[10] = result.reportRoMKnee.filter(x => x.side === 1)[0];
            this.kneeRightReport = result.reportRoMKnee.filter(x => x.side === 1)[0];
            this.rangeOfMotionReport[11] = result.reportRoMKnee.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[19] = true;
          } else {
            this.rangeOfMotionReport[19] = false;
          }
          // ANKLE
          if (result.reportRoMAnkle != null && result.reportRoMAnkle.length > 0) {
            this.ankleLeftReport = result.reportRoMAnkle.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[12] = result.reportRoMAnkle.filter(x => x.side === 1)[0];
            this.ankleRightReport = result.reportRoMAnkle.filter(x => x.side === 1)[0];
            this.rangeOfMotionReport[13] = result.reportRoMAnkle.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[20] = true;
          } else {
            this.rangeOfMotionReport[20] = false;
          }
          this.borgBalanceReport = result.borgBalanceReport;
          this.assessmentReport[9] = (result.borgBalanceReport != null) ? result.borgBalanceReport : 'Not Applicable';

          this.coordinationReport = result.coordinationReport;
          this.assessmentReport[13] = (result.coordinationReport != null) ? result.coordinationReport : 'Not Applicable';

          this.postureReport = result.postureReport;
          this.assessmentReport[14] = (result.postureReport != null) ? result.postureReport : 'Not Applicable';

          this.gaitReport = result.gaitReport;
          this.assessmentReport[15] = (result.gaitReport != null) ? result.gaitReport : 'Not Applicable';

          this.walkingReport = result.walkingProtocolReport;
          this.assessmentReport[16] = (result.walkingProtocolReport != null) ? result.walkingProtocolReport : 'Not Applicable';

          this.stairClimbing = result.stairClimbingProtocolReport;
          this.assessmentReport[17] = (result.stairClimbingProtocolReport != null) ? result.stairClimbingProtocolReport : 'Not Applicable';

          this.balanceReport = result.balanceProtocolReport;
          this.assessmentReport[18] = (result.balanceProtocolReport != null) ? result.balanceProtocolReport : 'Not Applicable';

          this.ladderWork = result.ladderWorkProtocolReport;
          this.assessmentReport[19] = (result.ladderWorkProtocolReport != null) ? result.ladderWorkProtocolReport : 'Not Applicable';

          this.repetitiveSquatting = result.repetitiveSquattingProtocolReport;
          this.assessmentReport[20] = (result.repetitiveSquattingProtocolReport != null) ?
            result.repetitiveSquattingProtocolReport : 'Not Applicable';

          this.repetitiveFootMotionReport = result.repetitiveFootMotionProtocolReport;
          this.assessmentReport[21] = (result.repetitiveFootMotionProtocolReport != null) ?
            result.repetitiveFootMotionProtocolReport : 'Not Applicable';

          this.crawlingReport = result.crawlingProtocolReport;
          this.assessmentReport[22] = (result.crawlingProtocolReport != null) ? result.crawlingProtocolReport : 'Not Applicable';
          /*************************.**************************************************************
           * COGNITIVE ASSESSMENT REPORT SECTION
           ****************************************************************************************/
          if (result.attentionAndConcentration != null) {
            this.assessmentReport[23] = (
              result.attentionAndConcentration.comment != null) ? result.attentionAndConcentration.comment : 'No Comment';
          } else {
            this.assessmentReport[23] = 'Not Applicable';
          }
          if (gender === 0) {
            this.assessmentReport[24] = 'She';
          } else if (gender === 1) {
            this.assessmentReport[24] = 'He';
          }
          this.assessmentReport[25] = (result.shortTermMemory != null &&
            result.shortTermMemory.score != null) ? result.shortTermMemory.score : -1;
          this.assessmentReport[26] = (result.shortTermMemory != null &&
            result.shortTermMemory.score != null) ? result.shortTermMemory.totalScore : -1;
          this.assessmentReport[27] = (result.shortTermMemory != null &&
            result.shortTermMemory.memoryAssessmentType != null) ? result.shortTermMemory.memoryAssessmentType : 'NONE';
          if (result.longTermMemory != null) {
            this.assessmentReport[28] = (
              result.longTermMemory.comment != null) ? result.longTermMemory.comment : 'No Comment';
          } else {
            this.assessmentReport[28] = 'Not Applicable';
          }
          if (result.insight != null) {
            this.assessmentReport[29] = (
              result.insight.comment != null) ? result.insight.comment : 'No Comment';
          } else {
            this.assessmentReport[29] = 'Not Applicable';
          }
          if (result.reading != null) {
            this.assessmentReport[30] = (
              result.reading.comment != null) ? result.reading.comment : 'No Comment';
          } else {
            this.assessmentReport[30] = 'Not Applicable';
          }
          if (result.speech != null) {
            this.assessmentReport[31] = (result.speech.comment != null) ? result.speech.comment : 'No Comment';
          } else {
            this.assessmentReport[31] = 'Not Applicable';
          }
          if (result.writing != null) {
            this.assessmentReport[32] = (result.writing.comment != null) ? result.writing.comment : 'No Comment';
          } else {
            this.assessmentReport[32] = 'Not Applicable';
          }
          if (result.visualPerception != null) {
            this.assessmentReport[33] = (result.visualPerception.comment != null) ? result.visualPerception.comment : 'No Comment';
          } else {
            this.assessmentReport[33] = 'Not Applicable';
          }

        });
      this.getReportData(client.id);
    })).subscribe((result) => {
      entity = result;
      if (entity.lawFirm != null && entity.lawFirm.physicalAddress != null) {
        this.lawFirmCity = (entity.lawFirm.physicalAddress.city != null) ? entity.lawFirm.physicalAddress.city : '';
      }
      this.getMedicalHistory(client.id);
      this.getWorkHistory(client.id);
      this.getClientHistory(client.id);
      this.getFileData(client.id);
      this._reportSummaryService.getByClientId(client.id)
        .subscribe(reportSummary => {
          if (reportSummary != null) {
            this.assessmentReport[36] = (reportSummary.discussion != null) ?
              reportSummary.discussion : 'Not Applicable';
            this.assessmentReport[37] = (reportSummary.recommendations != null) ?
              reportSummary.recommendations : 'Not Applicable';
            this.assessmentReport[48] = (reportSummary.caseManagement1 != null) ?
              reportSummary.caseManagement1 : 'Not Applicable';
            this.assessmentReport[40] = (reportSummary.lossOfEmenities != null) ?
              reportSummary.lossOfEmenities : 'Not Applicable';
            this.assessmentReport[46] = (reportSummary.occupationalTherapy != null) ?
              reportSummary.occupationalTherapy : 'Not Applicable';
            this.assessmentReport[45] = (reportSummary.physiotherapy != null) ?
              reportSummary.physiotherapy : 'Not Applicable';
            this.assessmentReport[42] = (reportSummary.futureMedicalExpenses != null) ?
              reportSummary.futureMedicalExpenses : 'Not Applicable';
            this.assessmentReport[43] = (reportSummary.futureMedicalAndSurgicalIntervention != null) ?
              reportSummary.futureMedicalAndSurgicalIntervention : 'Not Applicable';
            this.assessmentReport[47] = (reportSummary.specialEquipment != null) ?
              reportSummary.specialEquipment : 'Not Applicable';
            this.assessmentReport[44] = (reportSummary.supplementaryHealthServices != null) ?
              reportSummary.supplementaryHealthServices : 'Not Applicable';
            this.assessmentReport[41] = (reportSummary.residualWorkCapacity != null) ?
              reportSummary.residualWorkCapacity : 'Not Applicable';
            this.assessmentReport[49] = (reportSummary.transportationCosts != null) ?
              reportSummary.transportationCosts : 'Not Applicable';
            this.assessmentReport[50] = (reportSummary.psychology != null) ?
              reportSummary.psychology : 'Not Applicable';
            this.assessmentReport[60] = (reportSummary.homeAdaptions != null) ?
              reportSummary.homeAdaptions : 'Not Applicable';
          }
        });
      this._workInformationService.getByClientId(client.id)
        .pipe(finalize(() => {
        })).subscribe(workResult => {
          this.jobTitle = workResult.jobTitle;
          this._workAssessmentReportService.getPositionalToleranceReport(client.id)
            .subscribe(workAssessmentReport => {
              if (this.jobTitle != null && this.jobTitle !== '') {
                this.positionalToleranceResult = workAssessmentReport;
              }
            });
          this._workAssessmentReportService.getWeightedProtocolReport(client.id)
            .subscribe(workAssessmentReport => {
              if (this.jobTitle != null && this.jobTitle !== '') {
                this.weightedProtocolResult = workAssessmentReport;
              }
            });
          this._workAssessmentReportService.getRepetitiveToleranceReport(client.id)
            .subscribe(workAssessmentReport => {
              if (this.jobTitle != null && this.jobTitle !== '') {
                this.repetitiveToleranceResult = workAssessmentReport;
              }
            });
        });
    });
  }
  async generateDocument(docCreator: DocumentCreator, entity: ClientDetailOutput, address: CreateAddressInput) {
    const today = moment().format('LL');
    docCreator.generateDoc([entity, address, this.filteredDocuments, this.medicalData,
      this.workData, this.lawFirmCity, this.assessmentReport, this.rangeOfMotionReport], today);

  }
  async getMedicalHistory(id) {
    this._reportService.getMedicalHistoryByClientId(id)
      .pipe(finalize(() => {
      }))
      .subscribe((result) => {
        this.medicalData = result;
      });
  }
  async getFileData(id) {
    this.documentService.getClientDocuments(id)
      .pipe(finalize(() => { }))
      .subscribe((result) => {
        this.documents = result.items;
        const filtered = this.documents.map((value) => {
          return {
            date_authored: value.authorDate ? moment(value.authorDate).format('DD/MM/YYYY') : '',
            file_name: value.name,
            author_name: value.authorName
          };
        });
        this.filteredDocuments = filtered;
      });
  }
  async getWorkHistory(id) {
    this._reportService.getWorkHistoryByClientId(id)
      .pipe(finalize(() => { }))
      .subscribe((result) => {
        this.workData = result;
      });
  }
  async getClientHistory(id) {
    this.clientService.getById(id)
      .subscribe((result) => {
        this.client = result;
      });
  }
  getAge(entity: ClientListDto) {
    const idNumber: string = entity.idNumber;
    const cutoff = (new Date()).getFullYear() - 2000;
    const id_year = idNumber.substring(0, 2);
    const id_month = +idNumber.substring(2, 4) - 1;
    const id_day = +idNumber.substring(4, 6);
    const full_year = (+id_year > cutoff ? '19' : '20') + id_year;
    let currentAge = new Date().getFullYear() - (+full_year);
    if (id_month > new Date().getMonth()) {
      currentAge = currentAge - 1;
    } else if (id_month === new Date().getMonth() && id_day > new Date().getDate()) {
      currentAge = currentAge - 1;
    }
    return currentAge;
  }

  getDob(entity: ClientListDto) {
    const idNumber: string = entity.idNumber;
    const id_year = idNumber.substring(0, 2);
    const id_month = idNumber.substring(2, 4);
    const id_day = idNumber.substring(4, 6);
    const cutoff = (new Date()).getFullYear() - 2000;
    const full_year = (+id_year > cutoff ? '19' : '20') + id_year;
    const fullDate = id_day + '/' + id_month + '/' + full_year;
    return fullDate;
  }
  handleChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.totalItems = event.length;
    this.getDataPage(event.pageIndex + 1);
  }
  getElementNames(keyword, docCreator, entity) {
    this.ageList = [];
    this.maxDataValues = [];
    this._workAssessmentService.getWorkContext(keyword)
      .pipe(finalize(() => {
      }))
      .subscribe(result => {
        if (result != null && result.length > 0) {
          result.filter(x => x.elementID === '4.C.2.d.1.a' || x.elementID === '4.C.2.d.1.b' ||
            x.elementID === '4.C.2.d.1.c' || x.elementID === '4.C.2.d.1.d' || x.elementID === '4.C.2.d.1.e'
            || x.elementID === '4.C.2.d.1.f' || x.elementID === '4.C.2.d.1.g' || x.elementID === '4.C.2.d.1.h' ||
            x.elementID === '4.C.2.d.1.i')
            .forEach((workContext) => {
              const dataValues: number[] = [];
              if (this.ageList.indexOf(workContext.elementName) === -1) {
                result.filter(x => x.elementID === workContext.elementID)
                  .forEach((i) => {
                    dataValues.push(i.dataValue);
                  });
                if (workContext.dataValue === Math.max.apply(null, dataValues)) {
                  const maxDataValue = new MaxDataValue();
                  maxDataValue.dataValue = Math.max.apply(null, dataValues);
                  maxDataValue.title = workContext.title;
                  maxDataValue.elementId = workContext.elementID;
                  maxDataValue.elementName = workContext.elementName;
                  maxDataValue.category = workContext.category;
                  this.maxDataValues.push(maxDataValue);
                  this.ageList.push(workContext.elementName);
                }
              }
            });
          if (this.positionalToleranceResult != null && this.positionalToleranceResult.length > 0) {
            this.positionalToleranceResult.forEach((item) => {
              let element: MaxDataValue;
              item.assessmentName = (item.assessmentName) ? item.assessmentName : '';
              if (item.assessmentName.includes('Sitting')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.a')[0];
                if (element != null) {
                  item.jobDemand = this.calculateJobDemandResult(element.dataValue);
                }
              } else if (item.assessmentName.includes('Kneeling')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.e')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this.calculateJobDemandResult(element.dataValue);
                }
              } else if (item.assessmentName.includes('Crouching')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.e')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this.calculateJobDemandResult(element.dataValue);
                }
              } else if (item.assessmentName.includes('Standing')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.b')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this.calculateJobDemandResult(element.dataValue);
                }
              } else if (item.assessmentName.includes('Elevated')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.g')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this.calculateJobDemandResult(element.dataValue);
                }
              } else if (item.assessmentName.includes('Mid Level')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.g')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this.calculateJobDemandResult(element.dataValue);
                }
              }

            });
            if (this.positionalToleranceResult.filter(x => x.assessmentName != null).length > 0) {
              this.assessmentReport[51] = true;
              this.assessmentReport[57] = false;
              const filtered = this.positionalToleranceResult.filter(x => x.assessmentName != null &&
                (x.result != null && x.result !== '')).map((value) => {
                  return {
                    activity: value.assessmentName,
                    performance: value.result,
                    jobDemand: value.jobDemand
                  };

                });
              this.assessmentReport[54] = filtered;
            } else {
              this.assessmentReport[51] = false;
              this.assessmentReport[57] = true;
            }
          }
          if (this.weightedProtocolResult != null && this.weightedProtocolResult.length > 0) {
            this.weightedProtocolResult.forEach((item) => {
              let element: MaxDataValue;
              item.assessmentName = (item.assessmentName) ? item.assessmentName : '';
              if (item.assessmentName.includes('Core Lifting')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.j')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this._assessmentServ.decodeOnetCategory(element.category);
                }
              } else if (item.assessmentName.includes('Unilateral')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.i')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this._assessmentServ.decodeOnetCategory(element.category);
                }
              } else if (item.assessmentName.includes('Pushing')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.h')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this._assessmentServ.decodeOnetCategory(element.category);
                }
              } else if (item.assessmentName.includes('Pulling')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.h')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this._assessmentServ.decodeOnetCategory(element.category);
                }
              } else if (item.assessmentName.includes('Bilateral')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.i')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this._assessmentServ.decodeOnetCategory(element.category);
                }
              }
            });
            if (this.weightedProtocolResult.filter(x => x.assessmentName != null).length > 0) {
              const filtered = this.weightedProtocolResult.filter(x => x.assessmentName != null &&
                (x.result != null && x.result !== '')).map((value) => {
                  return {
                    activity: value.assessmentName,
                    performance: value.result,
                    jobDemand: value.jobDemand ? value.jobDemand : ''
                  };

                });
              this.assessmentReport[55] = filtered;
              this.assessmentReport[52] = true;
              this.assessmentReport[58] = false;
            } else {
              this.assessmentReport[52] = false;
              this.assessmentReport[58] = true;
            }
          }
          if (this.repetitiveToleranceResult != null && this.repetitiveToleranceResult.length > 0) {
            this.repetitiveToleranceResult.forEach((item) => {
              let element: MaxDataValue;
              item.assessmentName = (item.assessmentName) ? item.assessmentName : '';
              if (item.assessmentName.includes('Repetitive Squatting Protocol')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.i')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this.calculateJobDemandResult(element.dataValue);
                }
              } else if (item.assessmentName.includes('Ladder Work Protocol')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.c')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this.calculateJobDemandResult(element.dataValue);
                }
              } else if (item.assessmentName.includes('Balance Protocol')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.f')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this.calculateJobDemandResult(element.dataValue);
                }
              } else if (item.assessmentName.includes('Repetitive Foot Motion')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.i')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this.calculateJobDemandResult(element.dataValue);
                }
              } else if (item.assessmentName.includes('Crawling Protocol')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.e')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this.calculateJobDemandResult(element.dataValue);
                }
              } else if (item.assessmentName.includes('Walking Protocol')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.d')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this.calculateJobDemandResult(element.dataValue);
                }
              } else if (item.assessmentName.includes('Stair Climbing Protocol')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.c')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this.calculateJobDemandResult(element.dataValue);
                }
              }
              if (this.repetitiveToleranceResult.filter(x => x.assessmentName != null).length > 0) {
                const filtered = this.repetitiveToleranceResult.filter(x => x.assessmentName != null &&
                  (x.result != null && x.result !== '')).map((value) => {
                    return {
                      activity: value.assessmentName,
                      performance: value.result,
                      jobDemand: value.jobDemand
                    };
                  });
                this.assessmentReport[56] = filtered;
                this.assessmentReport[53] = true;
                this.assessmentReport[59] = false;
              } else {
                this.assessmentReport[53] = false;
                this.assessmentReport[59] = true;
              }
            });
          }
        }
        this.generateDocument(docCreator, entity, entity.address)
          .then(() => {
            this.isGenerating = false;
          })
          .catch((error) => {
            this.notify.error('An Error Occurred Please Try Again to Download');
            this.isGenerating = false;
          });
      });
  }
  calculateJobDemandResult(dataValue: number): string {
    let jobDemand = '';
    if (dataValue < 1) {
      jobDemand = 'NIL';
    } else if (dataValue <= 5) {
      jobDemand = 'RARE';
    } else if (dataValue <= 33) {
      jobDemand = 'CONSTANT';
    } else if (dataValue <= 66) {
      jobDemand = 'FREQUENT';
    } else if (dataValue <= 100) {
      jobDemand = 'OCCASIONAL';
    }
    return jobDemand;
  }
  async getReportData(clientId: string) {
    await this.getSensation(clientId);
    await this.getMobility(clientId);
    await this.getAffect(clientId);
  }

  async getSensation(clientId: string) {
    this._sensationService.getSensation(clientId)
      .pipe(finalize(() => {
      }))
      .subscribe(
        (sensation) => {
          this.comment = (sensation != null && sensation.otComment != null) ? sensation.otComment : '';
          this.assessmentReport[10] = this.comment;
        }
      );
  }

  async getMobility(clientId: string) {
    this._mobilityService.getByClientAsync(clientId)
      .pipe(finalize(() => {
      }))
      .subscribe(
        (result) => {
          this.mobility = result;
          this.mobilityComment = (result.comment != null) ? result.comment : '';
          this.assessmentReport[11] = (result.comment != null) ? result.comment : '';
        }
      );
  }
  async getAffect(clientId: string) {
    this._affectService.getByClientAsync(clientId)
      .pipe(finalize(() => {
      })).subscribe(
        (affect) => {
          this.affect = affect;
          this.assessmentReport[12] = (affect.comment != null) ? affect.comment : '';
        }
      );
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
            this.refresh();
          }), catchError(error => {
            if (error) {
              abp.notify.error('An Error Occured: Not Permmited');
              return;
            }
            return of({ results: null });
          })).subscribe(() => { }, error => { },
            () => {
              abp.notify.success('Deleted Client: ' + entity.firstName + ' ' + entity.lastName);
            });
        } else {
          this.isSaving = false;
        }
      }
    );
  }
}
