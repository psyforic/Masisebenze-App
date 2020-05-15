import { WorkHistoryListDto, MedicalHistoryListDto, ClientAssessmentReportServiceProxy, WorkAssessmentReportServiceProxy, ReportSummaryServiceProxy, AffectServiceProxy, MobilityServiceProxy, SensationServiceProxy, AttorneyServiceProxy, PositionalToleranceDto, WeightedProtocolDto, RepetitiveToleranceDto, WorkInformationServiceProxy, WorkAssessmentServiceProxy } from './../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, ViewChild, Injector, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { NewContactComponent } from '../new-contact/new-contact.component';
import { NewClientComponent } from '../new-client/new-client.component';
import { ActivatedRoute } from '@angular/router';
import {
  LawFirmServiceProxy,
  LawFirmDetailOutput,
  ContactListDto,
  ContactServiceProxy,
  ClientServiceProxy,
  ClientListDto,
  AttorneyListDto,
  CreateAddressInput,
  WorkHistoryDetailOutput,
  MedicalHistoryDetailOutput,
  DocumentListDto,
  DocumentServiceProxy,
  AddressDetailOutput,
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
  AffectDto,
  MobilityDto,
} from '@shared/service-proxies/service-proxies';
import { finalize, catchError } from 'rxjs/operators';
import { NewAttorneyComponent } from '../../attorneys/new-attorney/new-attorney.component';
import { ViewAttorneyComponent } from '../../attorneys/view-attorney/view-attorney.component';
import { EditAttorneyComponent } from '../../attorneys/edit-attorney/edit-attorney.component';
import { EditContactComponent } from '../../contacts/edit-contact/edit-contact.component';
import { DocumentCreator } from '@app/admin/partials/document-creator';
import * as moment from 'moment';
import { AppComponentBase } from '@shared/app-component-base';
import { Location } from '@angular/common';
import { GeneralService } from '@app/admin/services/general.service';
import { PagedRequestDto, PagedListingComponentBase } from '@shared/paged-listing-component-base';
import { of } from 'rxjs';
import { TopBarService } from '@app/admin/services/top-bar.service';

export class MaxDataValue {
  elementId: string;
  elementName: string;
  title: string;
  dataValue: number;
  category: number;
}
@Component({
  selector: 'app-view-lawfirm',
  templateUrl: './view-lawfirm.component.html',
  styleUrls: ['./view-lawfirm.component.scss'],
  providers: [LawFirmServiceProxy, ContactServiceProxy, ClientServiceProxy, WorkAssessmentServiceProxy,
    DocumentServiceProxy, ReportServiceProxy, WorkInformationServiceProxy]
})
export class ViewLawfirmComponent extends AppComponentBase implements OnInit {

  @ViewChild('contactPaginator', { static: false }) contactPaginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @ViewChild('clientPaginator', { static: false }) clientPaginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) clientSort: MatSort;

  @ViewChild('attorneyPaginator', { static: false }) attorneyPaginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) attorneySort: MatSort;

  @ViewChild('newContact', { static: false }) newContactRef: NewContactComponent;
  @ViewChild('editContact', { static: false }) editContactRef: EditContactComponent;

  @ViewChild('newClient', { static: false }) newClientRef: NewClientComponent;
  @ViewChild('newAttorney', { static: false }) newAttorneyRef: NewAttorneyComponent;
  @ViewChild('viewAttorney', { static: false }) viewAttorneyRef: ViewAttorneyComponent;
  @ViewChild('editAttorney', { static: false }) editAttorneyRef: EditAttorneyComponent;


  dataSource: MatTableDataSource<ContactListDto> = new MatTableDataSource<ContactListDto>();
  clientDataSource: MatTableDataSource<ClientListDto> = new MatTableDataSource<ClientListDto>();
  attorneyDataSource: MatTableDataSource<AttorneyListDto> = new MatTableDataSource<AttorneyListDto>();

  contacts: ContactListDto[] = [];
  clients: ClientListDto[] = [];
  attorneys: AttorneyListDto[] = [];

  displayedColumns = ['firstName', 'lastName', 'email', 'role', 'actions'];
  displayedAttCols = ['firstName', 'lastName', 'email', 'phone', 'actions'];
  clientDisplayedColumns = ['firstName', 'lastName', 'dob', 'age', 'dateOfInjury', 'actions'];

  lawFirmId: string;
  // clients: ClientListDto[] = [];
  client: ClientListDto;
  // workData: WorkHistoryListDto = new WorkHistoryDetailOutput();
  // medicalData: MedicalHistoryListDto = new MedicalHistoryListDto();
  lawFirm: LawFirmDetailOutput = new LawFirmDetailOutput();
  isSaving = false;
  isLoading = false;
  workData: WorkHistoryDetailOutput = new WorkHistoryDetailOutput();
  medicalData: MedicalHistoryDetailOutput = new MedicalHistoryDetailOutput();
  lawFirmCity: string;
  documents: DocumentListDto[] = [];
  filteredDocuments;
  gripStrengthReport: ReportGripStrength;
  musclePowerReport: string;
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
  isGenerating = false;
  affect: AffectDto = new AffectDto();
  mobility: MobilityDto = new MobilityDto();
  positionalToleranceResult: PositionalToleranceDto[] = [];
  weightedProtocolResult: WeightedProtocolDto[] = [];
  repetitiveToleranceResult: RepetitiveToleranceDto[] = [];
  maxDataValues: MaxDataValue[] = [];
  ageList: string[] = [];
  jobTitle;
  attorneyPageSize;
  attorneyTotalItems;
  contactPageSize;
  contactTotalItems;
  clientPageSize;
  clientTotalItems;
  constructor(private injector: Injector,
    private route: ActivatedRoute,
    private _topBarService: TopBarService,
    private lawFimService: LawFirmServiceProxy,
    private contactService: ContactServiceProxy,
    private clientService: ClientServiceProxy,
    private _reportService: ReportServiceProxy,
    private _workInformationService: WorkInformationServiceProxy,
    private _workAssessmentService: WorkAssessmentServiceProxy,
    private _assessmentReportService: ClientAssessmentReportServiceProxy,
    private _workAssessmentReportService: WorkAssessmentReportServiceProxy,
    private _reportSummaryService: ReportSummaryServiceProxy,
    private _generalService: GeneralService,
    private documentService: DocumentServiceProxy,
    private _affectService: AffectServiceProxy,
    private _mobilityService: MobilityServiceProxy,
    private _sensationService: SensationServiceProxy,
    private _location: Location) {
    super(injector);
    this.route.paramMap.subscribe((paramMap) => {
      this.lawFirmId = paramMap.get('id');
      this._topBarService.setTitle('Law Firm Details');
    });
  }
  ngOnInit() {
    this.getLawFirm();
    this.getAttorneys();
    this.getContacts();
    this.getClients();
    this.clientPageSize = 5;

  }

  backClicked() {
    this._location.back();
  }
  getLawFirm() {
    this.isLoading = true;
    this.lawFirm.physicalAddress = new AddressDetailOutput();
    this.lawFirm.postalAddress = new AddressDetailOutput();
    this.lawFimService.getDetail(this.lawFirmId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.lawFirm = result;
      });
  }

  addContact() {
    this.newContactRef.open();
  }
  editSelectedContact(id: string) {
    this.editContactRef.open(id);
  }
  deleteContact(contact: any) {
    this.editContactRef.delete(contact);
  }
  addClient() {
    this.newClientRef.open(this.lawFirmId);
  }
  addAttorney() {
    this.newAttorneyRef.open();
  }
  displayContact(contact) {
    this.getContacts();
  }
  viewSelectedAttorney(id: string) {
    this.viewAttorneyRef.open(id);
  }
  editSelectedAttorney(id: string) {
    this.editAttorneyRef.open(id);
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.clientDataSource.filter = filterValue;
  }
  getAttorneys() {
    this.isLoading = true;
    this.lawFimService.getAttorneys(this.lawFirmId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.attorneys = result.items;
        this.attorneyDataSource.data = result.items;
        this.attorneyDataSource.paginator = this.attorneyPaginator;
        this.attorneySort = this.attorneySort;
      });
  }
  deleteAttorney(entity: any) {
    this.editAttorneyRef.delete(entity);
    this.getAttorneys();
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
  attorneyHandleChange(event: PageEvent) {
    this.attorneyPageSize = event.pageSize;
    this.attorneyTotalItems = event.length;
    // this.getDataPage(event.pageIndex + 1);
  }
  contactHandleChange(event: PageEvent) {
    this.contactPageSize = event.pageSize;
    this.contactTotalItems = event.length;
    // this.getDataPage(event.pageIndex + 1);
  }
  clientHandleChange(event: PageEvent) {
    this.clientPageSize = event.pageSize;
    this.clientTotalItems = event.length;
    // this.getDataPage(event.pageIndex + 1);
  }
  generate(client) {
    let entity: ClientDetailOutput = new ClientDetailOutput();
    this.isGenerating = true;
    this._reportService.getPersonalDetails(client.id).pipe(finalize(() => {
      const address: CreateAddressInput = new CreateAddressInput();
      const age = this._generalService.getAge('' + client.idNumber);
      const gender = this._generalService.getGender('' + client.idNumber);
      this._assessmentReportService.getAssessmentReport(entity.id, gender, age)
        .pipe(finalize(() => {
          // console.log(this.positionalToleranceResult);
          // console.log(this.weightedProtocolResult);
          // console.log(this.repetitiveToleranceResult);
          this.isGenerating = false;
          const docCreator = new DocumentCreator();
          if (this.positionalToleranceResult != null && this.positionalToleranceResult.length > 0) {
            this.positionalToleranceResult = this.positionalToleranceResult.
              filter(x => x.assessmentName != null && x.assessmentName !== '');
          }
          if (this.weightedProtocolResult != null && this.positionalToleranceResult.length > 0) {
            this.weightedProtocolResult = this.positionalToleranceResult.
              filter(x => x.assessmentName != null && x.assessmentName !== '');
          }
          if (this.repetitiveToleranceResult != null && this.positionalToleranceResult.length > 0) {
            this.repetitiveToleranceResult = this.repetitiveToleranceResult.
              filter(x => x.assessmentName != null && x.assessmentName !== '');
          }
          this.getElementNames(this.jobTitle, docCreator, entity);
          // setTimeout(async () => {
          // }, 20000);
        }))
        .subscribe((result) => {
          // console.log(result);
          /***************************************************************************************
           * COGNITIVE ASSESSMENT REPORT SECTION
           ****************************************************************************************/
          this.gripStrengthReport = result.reportGripStrength;
          this.assessmentReport[0] = result.reportGripStrength;

          this.musclePowerReport = result.musclePowerReport;
          this.assessmentReport[1] = result.musclePowerReport;
          if (result.reportRoMShoulder != null && result.reportRoMShoulder.length > 0) {
            this.shoulderLeftReport = result.reportRoMShoulder.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[0] = result.reportRoMShoulder.filter(x => x.side === 1)[0];
            this.shoulderRightReport = result.reportRoMShoulder.filter(x => x.side === 1)[0];
            this.rangeOfMotionReport[1] = result.reportRoMShoulder.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[14] = true;
          } else {
            this.rangeOfMotionReport[14] = false;
          }
          if (result.reportRoMForearmWrist != null && result.reportRoMForearmWrist.length > 0) {
            this.forearmWristLeftReport = result.reportRoMForearmWrist.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[2] = result.reportRoMForearmWrist.filter(x => x.side === 1)[0];
            this.forearmWristRightReport = result.reportRoMForearmWrist.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[3] = result.reportRoMForearmWrist.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[15] = true;
          } else {
            this.rangeOfMotionReport[15] = false;
          }

          if (result.reportRoMElbow != null && result.reportRoMElbow.length > 0) {
            this.elbowLeftReport = result.reportRoMElbow.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[4] = result.reportRoMElbow.filter(x => x.side === 1)[0];
            this.elbowRightReport = result.reportRoMElbow.filter(x => x.side === 1)[0];
            this.rangeOfMotionReport[5] = result.reportRoMElbow.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[16] = true;
          } else {
            this.rangeOfMotionReport[16] = false;
          }

          if (result.reportRoMHand != null && result.reportRoMHand.length > 0) {
            this.handLeftReport = result.reportRoMHand.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[6] = result.reportRoMHand.filter(x => x.side === 1)[0];
            this.handRightReport = result.reportRoMHand.filter(x => x.side === 1)[0];
            this.rangeOfMotionReport[7] = result.reportRoMHand.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[17] = true;
          } else {
            this.rangeOfMotionReport[17] = false;
          }

          if (result.reportRoMHip != null && result.reportRoMHip.length > 0) {
            this.hipLeftReport = result.reportRoMHip.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[8] = result.reportRoMHip.filter(x => x.side === 1)[0];
            this.hipRightReport = result.reportRoMHip.filter(x => x.side === 1)[0];
            this.rangeOfMotionReport[9] = result.reportRoMHip.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[18] = true;
          } else {
            this.rangeOfMotionReport[18] = false;
          }

          if (result.reportRoMKnee != null && result.reportRoMKnee.length > 0) {
            this.kneeLeftReport = result.reportRoMKnee.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[10] = result.reportRoMKnee.filter(x => x.side === 1)[0];
            this.kneeRightReport = result.reportRoMKnee.filter(x => x.side === 1)[0];
            this.rangeOfMotionReport[11] = result.reportRoMKnee.filter(x => x.side === 0)[0];
            this.rangeOfMotionReport[19] = true;
          } else {
            this.rangeOfMotionReport[19] = false;
          }

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
      this.getReportData(client.id, age, gender);
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
  async getReportData(clientId: string, age: number, gender: number) {
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
            this.positionalToleranceResult.forEach((item, index) => {
              let element: MaxDataValue;
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
            this.weightedProtocolResult.forEach((item, index) => {
              let element: MaxDataValue;
              if (item.assessmentName.includes('Lifting')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.j')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this.calculateJobDemandResult(element.dataValue);
                }
              } else if (item.assessmentName.includes('Unilateral')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.i')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this.calculateJobDemandResult(element.dataValue);
                }
              } else if (item.assessmentName.includes('Pushing')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.h')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this.calculateJobDemandResult(element.dataValue);
                }
              } else if (item.assessmentName.includes('Pulling')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.h')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this.calculateJobDemandResult(element.dataValue);
                }
              } else if (item.assessmentName.includes('Bilateral')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.i')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.jobDemand = this.calculateJobDemandResult(element.dataValue);
                }
              }
            });
            if (this.weightedProtocolResult.filter(x => x.assessmentName != null).length > 0) {
              const filtered = this.weightedProtocolResult.filter(x => x.assessmentName != null &&
                (x.result != null && x.result !== '')).map((value) => {
                  return {
                    activity: value.assessmentName,
                    performance: value.result,
                    jobDemand: value.jobDemand
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
            this.repetitiveToleranceResult.forEach((item, index) => {
              let element: MaxDataValue;
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
          .catch(error => {
            this.notify.error('An Error Occurred Please Try Again to Download');
          });
      });
  }
  getContacts() {
    this.isLoading = true;
    this.contactService.getByLawFirm(this.lawFirmId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.contacts = result.items;
        this.dataSource.data = this.contacts;
        this.dataSource.paginator = this.contactPaginator;
        this.dataSource.sort = this.sort;
      });
  }
  getClients() {
    this.isLoading = true;
    this.lawFimService.getClients(this.lawFirmId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.clients = result.items;
        this.clientTotalItems = this.clients.length;
        this.clientDataSource.data = this.clients;
        this.clientDataSource.paginator = this.clientPaginator;
        this.clientDataSource.sort = this.clientSort;
      });
  }

  protected delete(entity: ContactListDto): void {
    abp.message.confirm(
      'Delete Contact \'' + entity.firstName + '\'?',
      (result: boolean) => {
        if (result) {
          this.isLoading = true;
          this.contactService.delete(entity.id)
            .pipe(finalize(() => {
              this.isLoading = false;
            }), catchError(error => {
              if (error) {
                abp.notify.error('An Error Occured: Not Permmited');
                return;
              }
              return of({ results: null });
            })).subscribe(() => {
              this.getContacts();
            }, error => { },
              () => {
                abp.notify.success('Deleted Contact: ' + entity.firstName);
              });
        }
      }
    );
  }

  protected deleteClient(entity: ClientListDto): void {
    abp.message.confirm(
      'Delete Client \'' + entity.firstName + ' ' + entity.lastName + '\'?',
      (result: boolean) => {
        if (result) {
          this.isLoading = true;
          this.clientService.delete(entity.id)
            .pipe(finalize(() => {
              this.isLoading = false;
              this.getClients();
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
        }
      }
    );
  }

}
