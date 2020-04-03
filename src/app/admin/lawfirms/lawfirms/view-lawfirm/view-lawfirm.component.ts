import { WorkHistoryListDto, MedicalHistoryListDto, ClientAssessmentReportServiceProxy, WorkAssessmentReportServiceProxy, ReportSummaryServiceProxy, AffectServiceProxy, MobilityServiceProxy, SensationServiceProxy, AttorneyServiceProxy } from './../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, ViewChild, Injector } from '@angular/core';
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
import { finalize } from 'rxjs/operators';
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


@Component({
  selector: 'app-view-lawfirm',
  templateUrl: './view-lawfirm.component.html',
  styleUrls: ['./view-lawfirm.component.scss'],
  providers: [LawFirmServiceProxy, ContactServiceProxy, ClientServiceProxy, 
    DocumentServiceProxy, ReportServiceProxy]
})
export class ViewLawfirmComponent extends AppComponentBase implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @ViewChild(MatPaginator, { static: false }) clientPaginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) clientSort: MatSort;


  @ViewChild(MatPaginator, { static: false }) attorneyPaginator: MatPaginator;
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

  pageSize;
  totalItems;
  constructor(private injector: Injector,
    private route: ActivatedRoute,
    private lawFimService: LawFirmServiceProxy,
    private contactService: ContactServiceProxy,
    private clientService: ClientServiceProxy,
    private _reportService: ReportServiceProxy,
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

    });
  }
  ngOnInit() {
    this.getLawFirm();
    this.getAttorneys();
    this.getContacts();
    this.getClients();
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
  handleChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.totalItems = event.length;
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
          console.log(this.assessmentReport);
          this.isGenerating = false;
          const docCreator = new DocumentCreator();
          // setTimeout(async () => {
          this.generateDocument(docCreator, entity, entity.address)
            .then(() => {
              // this.notify.success('Saved Successfully', 'Success');
              this.isGenerating = false;
            })
            .catch(error => {
              this.notify.error('An Error Occurred Please Try Again to Download');
            });
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
      this.lawFirmCity = entity.address.city;
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
      this._workAssessmentReportService.getPositionalToleranceTasksParentReport(client.id)
        .subscribe(workAssessmentReport => {
          if (workAssessmentReport.filter(x => x.assessmentName != null).length > 0) {
            const filtered = workAssessmentReport.filter(x => x.assessmentName != null).map((value) => {
              // if (value.assessmentName != null && value.assessmentName != '') {
              return {
                taskName: value.assessmentName,
                taskComment: value.comment != null ? value.comment : 'No Comment'
              };

            });
            this.assessmentReport[38] = filtered;
          } else {
            this.assessmentReport[38] = {
              taskName: 'Not Applicable',
              taskComment: ''
            };
          }

        });
      this._workAssessmentReportService.getWeightedProtocolTaskParentReport(client.id)
        .subscribe(workAssessmentReport => {
          if (workAssessmentReport.filter(x => x.assessmentName != null).length > 0) {
            const filtered = workAssessmentReport.filter(x => x.assessmentName != null).map((value) => {
              return {
                taskName: value.assessmentName,
                taskComment: value.comment != null ? value.comment : 'No Comment'
              };

            });
            this.assessmentReport[39] = filtered;
          } else {

            this.assessmentReport[39] = {
              taskName: 'Not Applicable',
              taskComment: ''
            };
          }
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

  getDob(entity: ClientListDto) {
    const idNumber: string = '' + entity.idNumber;
    const tempDate = new Date(
      +idNumber.substr(0, 2),
      +(idNumber.substring(2, 4)) - 1,
      +idNumber.substring(4, 6));
    const fullDate = moment(tempDate).format('DD/MM/YYYY');
    return fullDate;
  }


  async getReportData(clientId: string, age: number, gender: number) {
    await this.getSensation(clientId);
    await this.getMobility(clientId);
    await this.getAffect(clientId);
   
  }
  
  async  getSensation(clientId: string) {
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
  
  getContacts() {
    this.isLoading = true;
    this.contactService.getByLawFirm(this.lawFirmId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.contacts = result.items;
        this.dataSource.data = this.contacts;
        this.dataSource.paginator = this.paginator;
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
        this.clientDataSource.data = result.items;
        this.clientDataSource.paginator = this.clientPaginator;
        this.clientDataSource.sort = this.clientSort;
      });
  }

  protected delete(entity: ContactListDto): void {
    abp.message.confirm(
      'Delete Contact \'' + entity.firstName + '\'?',
      (result: boolean) => {
        if (result) {
          this.contactService.delete(entity.id).pipe(finalize(() => {
            abp.notify.success('Deleted Contact: ' + entity.firstName);
          })).subscribe(() => {
            this.getContacts();
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
          this.contactService.delete(entity.id).pipe(finalize(() => {
            abp.notify.success('Deleted Client: ' + entity.firstName + ' ' + entity.lastName);
            this.getClients();
          })).subscribe(() => {

          });
        }
      }
    );
  }

}
