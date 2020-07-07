import { WorkAssessmentComponent } from './../assessments/work-assessment/work-assessment.component';
import { AssessmentService } from '@app/admin/services/assessment.service';
import { CognitiveAssessmentsComponent } from './../assessments/cognitive-assessments/cognitive-assessments.component';
import { TopBarService } from './../../../services/top-bar.service';
import { QuestionnaireComponent } from './../assessments/functional-assessment/questionnaire/questionnaire.component';
import { FunctionalAssessmentComponent } from './../assessments/functional-assessment/functional-assessment.component';
import { DocumentFolder } from './../../../documents/document-types';
import {
  DocumentListDto, Booking, FunctionalAssessmentServiceProxy,
  QuestionnaireDto,
  WorkAssessmentServiceProxy,
  WorkAssessmentReportServiceProxy,
  PositionalToleranceDto,
  WorkInformationServiceProxy,
  WeightedProtocolDto,
  AssessmentServiceProxy,
  StaticDataServiceProxy,
  AssessmentCategoryDetailOutput,
  AssessmentsListListDto,
  RepetitiveToleranceDto,
  JobDescriptionServiceProxy,
  JobDescriptionListDto
} from './../../../../../shared/service-proxies/service-proxies';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Injector, OnInit, ViewChild, HostListener } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';
import {
  MatTreeNestedDataSource,
  MatTabChangeEvent,
  MatDialog
} from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '@app/admin/services/general.service';
import { AppComponentBase } from '@shared/app-component-base';
import {
  BorgBalanceOptionListDto,
  ClientDetailOutput,
  ClientServiceProxy,
  CreateAddressInput,
  DocumentServiceProxy,
  GripStrengthDto,
  MedicalHistoryDetailOutput,
  MusclePowerDto,
  WorkHistoryDetailOutput,
  ContactListDto,
  LawFirmServiceProxy,
  AttorneyListDto
} from '@shared/service-proxies/service-proxies';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { GaitComponent } from '../assessments/gait/gait.component';
import { GripStrengthComponent } from '../assessments/grip-strength/grip-strength.component';
import { CameraModalComponent } from '../camera-modal/camera-modal.component';
import { RangeOfMotionComponent } from '../assessments/range-of-motion/range-of-motion.component';
import { BorgBalanceComponent } from '../assessments/borg-balance/borg-balance.component';
import { SensationComponent } from '../assessments/sensation/sensation.component';
import { CoordinationComponent } from '../assessments/coordination/coordination.component';
import { PostureComponent } from '../assessments/posture/posture.component';
import { RepetitiveToleranceProtocolComponent } from '../assessments/repetitive-tolerance-protocol/repetitive-tolerance-protocol.component';
import { MusclePowerComponent } from '../assessments/muscle-power/muscle-power.component';
import { AffectComponent } from '../assessments/affect/affect.component';
import { MobilityComponent } from '../assessments/mobility/mobility.component';
import { Location } from '@angular/common';
import * as moment from 'moment';
export const DD_MM_YYYY_Format = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
interface FolderNode {
  id: number;
  value: string;
  children?: any[];
}
export class MaxDataValue {
  elementId: string;
  elementName: string;
  title: string;
  dataValue: number;
  category: number;
}
export interface WeightedProtocolTable {
  id: string;
  activity: string;
  result: string;
  onetDescription: string;
  dotDescription: string;
  jobDemand: string;
}
@Component({
  selector: 'kt-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss'],
  providers: [ClientServiceProxy, DocumentServiceProxy, WorkAssessmentServiceProxy,
    LawFirmServiceProxy, FunctionalAssessmentServiceProxy, WorkAssessmentReportServiceProxy,
    WorkInformationServiceProxy, AssessmentServiceProxy, StaticDataServiceProxy, JobDescriptionServiceProxy,
    AssessmentService]
})
export class ViewClientComponent extends AppComponentBase implements OnInit {

  @ViewChild('clientForm', { static: false }) clientForm: NgForm;
  @ViewChild('newPhoto', { static: false }) takePhoto: CameraModalComponent;
  @ViewChild('gripStrength', { static: false }) openGripStrength: GripStrengthComponent;
  @ViewChild('musclePower', { static: false }) openMusclePower: MusclePowerComponent;
  @ViewChild('gait', { static: false }) openGait: GaitComponent;
  @ViewChild('rangeOfMotion', { static: false }) openRoM: RangeOfMotionComponent;
  @ViewChild('borgBalance', { static: false }) openBorgBalance: BorgBalanceComponent;
  @ViewChild('sensation', { static: false }) openSensation: SensationComponent;
  @ViewChild('coordination', { static: false }) openCoordination: CoordinationComponent;
  @ViewChild('posture', { static: false }) openPosture: PostureComponent;
  @ViewChild('rtp', { static: false }) openRTP: RepetitiveToleranceProtocolComponent;
  @ViewChild('affect', { static: false }) openAffect: AffectComponent;
  @ViewChild('mobility', { static: false }) openMobility: MobilityComponent;
  @ViewChild('functional', { static: false }) addQestionnaire: FunctionalAssessmentComponent;
  @ViewChild('questionnaire', { static: false }) questionnaire: QuestionnaireComponent;

  // Cogntive Assessments components
  @ViewChild('cognitiveAssessments', { static: false })
  cognitiveAssessments: CognitiveAssessmentsComponent;
  @ViewChild('assessmentTabs', { static: false }) assessmentTabs;

  ageList: string[] = [];
  client: ClientDetailOutput = new ClientDetailOutput();
  documentTypes = DocumentFolder.documentTypes;
  documents: DocumentListDto[] = [];
  workHistory: WorkHistoryDetailOutput = new WorkHistoryDetailOutput();
  medicalHistory: MedicalHistoryDetailOutput = new MedicalHistoryDetailOutput();
  treeControl = new NestedTreeControl<FolderNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FolderNode>();
  clientId = '';
  line1 = '';
  line2 = '';
  city = '';
  province = '';
  addressId = 0;
  postalCode = '';
  panelOpenState = false;
  isUploading = false;
  isLoading = false;
  loaded = false;
  borgLoaded = false;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;
  currentHistory = '';
  uploadedImage = '';
  photoUrl: string;
  dateOfInjury: any;
  courtDate: any;
  assessmentDate: any;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  fullName: string;
  gripStrength: GripStrengthDto = new GripStrengthDto();
  musclePower: MusclePowerDto = new MusclePowerDto();
  borgBalance: BorgBalanceOptionListDto[] = [];
  childDocuments: DocumentListDto[] = [];
  contacts: ContactListDto[] = [];
  attorneys: AttorneyListDto[] = [];
  questionnairesDto: QuestionnaireDto[] = [];
  positionalToleranceResult: PositionalToleranceDto[] = [];
  weightedProtocolResult: WeightedProtocolDto[] = [];
  weightedProtocolTables: Array<WeightedProtocolTable> = [];
  repetitiveToleranceResult: RepetitiveToleranceDto[] = [];
  displayedColumns: string[] = ['activity', 'peformance', 'jobDemand', 'deficit'];
  weightedProtocolDisplayedColumns: string[] = ['activity', 'result', 'onet_description', 'dot_description', 'action'];
  maxDataValues: MaxDataValue[] = [];
  assessmentCategories: AssessmentCategoryDetailOutput[] = [];
  selectedAssessments: AssessmentsListListDto[] = [];
  occupation: JobDescriptionListDto;
  jobTitle: string;
  hidden = true;
  bookings: Booking[] = [];
  questionnaires = [
    { type: 1, description: 'PATIENT HEALTH', status: 0 },
    { type: 2, description: 'DEPRESSION', status: 0 },
    { type: 3, description: 'ACTIVITIES OF DAILY LIVING', status: 0 },
    { type: 4, description: 'INSTRUMENTAL ACTIVITIES OF DAILY LIVING', status: 0 }
  ];
  categoryId: string;
  questionnaireType: number;
  questionnaireDescription: string;
  constructor(injector: Injector,
    private dialog: MatDialog,
    private _topBarService: TopBarService,
    private clientService: ClientServiceProxy,
    private _functionAssessmentService: FunctionalAssessmentServiceProxy,
    private _assessmentService: AssessmentServiceProxy,
    private _assessmentServ: AssessmentService,
    private _staticDataService: StaticDataServiceProxy,
    private _workAssessmentReportService: WorkAssessmentReportServiceProxy,
    private _workAssessmentService: WorkAssessmentServiceProxy,
    private _workInformationService: WorkInformationServiceProxy,
    private _jobDescriptionService: JobDescriptionServiceProxy,
    private documentService: DocumentServiceProxy,
    private _lawFirmService: LawFirmServiceProxy,
    private route: ActivatedRoute,
    private afStorage: AngularFireStorage,
    private generalService: GeneralService,
    private _location: Location
  ) {
    super(injector);
    this.route.paramMap.subscribe((paramMap) => {
      this.clientId = paramMap.get('id');
    });
    this._topBarService.setTitle('Client Details');
  }
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.clientForm.dirty) {
      $event.returnValue = true;
    }
  }
  getFileData() {
    this.isLoading = true;
    this.documentService.getClientDocuments(this.clientId).subscribe(
      (result) => {
        this.documents = result.items;
        if (this.documents != null && this.documents.length > 0) {
          const filtered = this.documentTypes.map((type) => {
            return {
              value: type.value,
              id: type.id,
              children: this.documents.filter(x => x.parentDocId === type.id).map(
                (doc) => {
                  return {
                    name: doc.name,
                    id: doc.id,
                    url: doc.fileUrl
                  };
                }
              )
            };
          });
          this.dataSource.data = filtered.filter(x => x.children.length > 0);
        } else {
          const filtered = this.documentTypes.map((type) => {
            return {
              value: type.value,
              id: type.id,
              children: []
            };
          });
          this.dataSource.data = filtered.filter(x => x.children.length > 0);
        }
        this.isLoading = false;
      }
    );

  }
  getDoc(id: number): DocumentListDto[] {
    let docs: DocumentListDto[] = [];
    this.documentService.getChildDocuments(id).subscribe(
      (result) => {
        docs = result.items;
      }
    );
    return docs;
  }
  dateFilter = (d: moment.Moment | null): boolean => {
    const day = d.day();
    return day !== 0 && day !== 6;
  }
  isInArray(value, array) {
    return array.indexOf(value) > -1;
  }
  getChildDocuments() {
    this.documentService.getAllChildDocuments(this.clientId)
      .subscribe(result => {
        this.childDocuments = result.items;
      });
  }
  ngOnInit() {
    this._staticDataService.getCategories()
      .subscribe(categories => {
        this.assessmentCategories = categories;
        // console.log(categories);
      });
    this.getClient();
    // this.questionnaires = this.generalService.getQuestionnaires();
    this.clientService.getMedicalHistoryByClientId(this.clientId)
      .pipe(finalize(() => { }))
      .subscribe((result) => {
        this.medicalHistory = result;
      });
    this.clientService.getWorkHistoryByClientId(this.clientId)
      .pipe(finalize(() => { }))
      .subscribe((result) => {
        this.workHistory = result;
      });
    this.generalService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }
  backClicked() {
    this._location.back();
  }
  getDocuments(documentId: number) {
    return this.childDocuments.filter(x => x.parentDocId === documentId);
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
  getPositionalToleranceReport(clientId) {
    this._workAssessmentReportService.getPositionalToleranceReport(clientId)
      .pipe(finalize(() => {
      })).subscribe(result => {
        this.positionalToleranceResult = result.filter(x =>
          (x.assessmentName != null && x.assessmentName !== '') &&
          (x.result != null && x.result !== ''));
        if (this.occupation != null) {
          this.positionalToleranceResult.forEach((item) => {
            if (item.assessmentName.includes('Sitting')) {
              item.jobDemand = (this.occupation.sittingJobDemand != null) ?
                this.occupation.sittingJobDemand.toUpperCase() : '';
            } else if (item.assessmentName.includes('Kneeling')) {
              item.jobDemand = (this.occupation.kneelingJobDemand != null) ?
                this.occupation.kneelingJobDemand.toUpperCase() : '';
            } else if (item.assessmentName.includes('Crouching')) {
              item.jobDemand = (this.occupation.crouchingJobDemand != null) ?
                this.occupation.crouchingJobDemand.toUpperCase() : '';
            } else if (item.assessmentName.includes('Standing')) {
              item.jobDemand = (this.occupation.standingJobDemand != null) ?
                this.occupation.standingJobDemand.toUpperCase() : '';
            } else if (item.assessmentName.includes('Elevated')) {
              item.jobDemand = (this.occupation.elevatedReachJobDemand != null) ?
                this.occupation.elevatedReachJobDemand.toUpperCase() : '';
            } else if (item.assessmentName.includes('Mid Level')) {
              item.jobDemand = (this.occupation.midLevelReachJobDemand != null) ?
                this.occupation.midLevelReachJobDemand.toUpperCase() : '';
            }
            if (item.jobDemand.includes('NIL') && !item.result.includes('NIL')) {
              item.isDeficit = 'Yes';
            } else if (item.jobDemand.includes('CONSTANT') && !item.result.includes('CONSTANT') &&
              !item.result.includes('NIL')) {
              item.isDeficit = 'Yes';
            } else if (item.jobDemand.includes('FREQUENT') && !item.result.includes('FREQUENT')
              && !item.result.includes('CONSTANT') && !item.result.includes('NIL')) {
              item.isDeficit = 'Yes';
            } else if (item.jobDemand.includes('OCCASIONAL') && item.result.includes('RARE')) {
              item.isDeficit = 'Yes';
            } else if (item.jobDemand.includes('RARE') && !item.result.includes('CONSTANT') &&
              !item.result.includes('NIL') && !item.result.includes('FREQUENT')
              && !item.result.includes('OCCASIONAL') && !item.result.includes('RARE')) {
              item.isDeficit = 'Yes';
            } else {
              item.isDeficit = 'No';
            }
          });
        } else {
          this.getElementNames(this.jobTitle);
        }
      });

  }
  getRepetitiveToleranceReport(clientId) {
    this._workAssessmentReportService.getRepetitiveToleranceReport(clientId)
      .pipe(finalize(() => {
      })).subscribe(result => {
        this.repetitiveToleranceResult = result.filter(x =>
          (x.assessmentName != null && x.assessmentName !== '') &&
          (x.result != null && x.result !== ''));

        if (this.occupation != null) {
          this.repetitiveToleranceResult.forEach((item) => {
            if (item.assessmentName.includes('Repetitive Squatting Protocol')) {
              item.jobDemand = (this.occupation.squattingJobDemand != null) ?
                this.occupation.squattingJobDemand.toUpperCase() : '';
            } else if (item.assessmentName.includes('Ladder Work Protocol')) {
              item.jobDemand = (this.occupation.ladderWorkJobDemand != null) ?
                this.occupation.ladderWorkJobDemand.toUpperCase() : '';
            } else if (item.assessmentName.includes('Balance Protocol')) {
              item.jobDemand = (this.occupation.balanceJobDemand != null) ?
                this.occupation.balanceJobDemand.toUpperCase() : '';
            } else if (item.assessmentName.includes('Repetitive Foot Motion')) {
              item.jobDemand = (this.occupation.repFootMotionJobDemand != null) ?
                this.occupation.repFootMotionJobDemand.toUpperCase() : '';
            } else if (item.assessmentName.includes('Crawling Protocol')) {
              item.jobDemand = (this.occupation.crawlingJobDemand != null) ?
                this.occupation.crawlingJobDemand.toUpperCase() : '';
            } else if (item.assessmentName.includes('Walking Protocol')) {
              item.jobDemand = (this.occupation.walkingJobDemand != null) ?
                this.occupation.walkingJobDemand.toUpperCase() : '';
            } else if (item.assessmentName.includes('Stair Climbing Protocol')) {
              item.jobDemand = (this.occupation.stairClimbingJobDemand != null) ?
                this.occupation.stairClimbingJobDemand.toUpperCase() : '';
            }
            if (item.jobDemand.includes('NIL') && !item.result.includes('NIL')) {
              item.isDeficit = 'Yes';
            } else if (item.jobDemand.includes('CONSTANT') && !item.result.includes('CONSTANT') &&
              !item.result.includes('NIL')) {
              item.isDeficit = 'Yes';
            } else if (item.jobDemand.includes('FREQUENT') && !item.result.includes('FREQUENT')
              && !item.result.includes('CONSTANT') && !item.result.includes('NIL')) {
              item.isDeficit = 'Yes';
            } else if (item.jobDemand.includes('OCCASIONAL') && item.result.includes('RARE')) {
              item.isDeficit = 'Yes';
            } else if (item.jobDemand.includes('RARE') && !item.result.includes('RARE')) {
              item.isDeficit = 'No';
            } else {
              item.isDeficit = 'No';
            }
          });
        } else {
          this.getElementNames(this.jobTitle);
        }
      });
  }
  getWorkInformation() {
    this.weightedProtocolResult = [];
    this.positionalToleranceResult = [];
    this.repetitiveToleranceResult = [];
    this._workInformationService.getByClientId(this.clientId)
      .pipe(finalize(() => {

      })).subscribe(workResult => {
        if (workResult != null && (workResult.jobTitle != null &&
          workResult.jobTitle !== '' &&
          typeof workResult.jobTitle != 'undefined')) {
          this.jobTitle = workResult.jobTitle;
          if (workResult.isLocal) {
            this._jobDescriptionService.getByTitle(workResult.jobTitle)
              .pipe(finalize(() => {
                this.isLoading = false;
              }))
              .subscribe(occupation => {
                this.occupation = occupation;

                this.getPositionalToleranceReport(this.clientId);
                this.getWeightedProtocolReport(this.clientId);
                this.getRepetitiveToleranceReport(this.clientId);
              });
          } else {
            this.getPositionalToleranceReport(this.clientId);
            this.getWeightedProtocolReport(this.clientId);
            this.getRepetitiveToleranceReport(this.clientId);
          }
        } else {
          this.jobTitle = 'No job title found';
          this.isLoading = false;
        }
      });
  }
  getWeightedProtocolReport(clientId: string) {
    this._workAssessmentReportService.getWeightedProtocolReport(clientId)
      .pipe(finalize(() => {
      })).subscribe(result => {
        this.weightedProtocolResult = result.filter(x =>
          (x.assessmentName != null && x.assessmentName !== '')
          && (x.result != null && x.result !== '')
        );
        if (this.occupation != null) {
          this.weightedProtocolTables = this.weightedProtocolResult.map(value => {
            return {
              id: value.targetId,
              activity: value.assessmentName,
              result: value.result,
              onetDescription: 'N/A',
              dotDescription: 'N/A',
              jobDemand: value.jobDemand
            };
          });
          this.weightedProtocolTables.forEach((item) => {
            if (item.activity.includes('Lifting')) {

              if (item.jobDemand != null && typeof item.jobDemand !== 'undefined') {
                item.onetDescription = this._assessmentServ.decodeOnetCategory(
                  this._assessmentServ.decodeDotResult(item.jobDemand)
                );
                item.dotDescription = this._assessmentServ.decodeDotCategory(
                  this._assessmentServ.decodeDotResult(item.jobDemand)
                );
              }
            } else if (item.activity.includes('Unilateral')) {
              if (item.jobDemand != null && typeof item.jobDemand !== 'undefined') {
                item.onetDescription = this._assessmentServ.decodeOnetCategory(
                  this._assessmentServ.decodeDotResult(item.jobDemand));
                item.dotDescription = this._assessmentServ.decodeDotCategory(
                  this._assessmentServ.decodeDotResult(item.jobDemand)
                );
              }
            } else if (item.activity.includes('Pushing')) {
              if (item.jobDemand != null && typeof item.jobDemand !== 'undefined') {
                item.onetDescription = this._assessmentServ.decodeOnetCategory(
                  this._assessmentServ.decodeDotResult(item.jobDemand)
                );
                item.dotDescription = this._assessmentServ.decodeDotCategory(
                  this._assessmentServ.decodeDotResult(item.jobDemand)
                );
              }
            } else if (item.activity.includes('Pulling')) {
              if (item.jobDemand != null && typeof item.jobDemand !== 'undefined') {
                item.onetDescription = this._assessmentServ.decodeOnetCategory(
                  this._assessmentServ.decodeDotResult(item.jobDemand)
                );
                item.dotDescription = this._assessmentServ.decodeDotCategory(
                  this._assessmentServ.decodeDotResult(item.jobDemand)
                );
              }
            } else if (item.activity.includes('Bilateral')) {
              if (item.jobDemand != null && typeof item.jobDemand !== 'undefined') {
                item.onetDescription = this._assessmentServ.decodeOnetCategory(
                  this._assessmentServ.decodeDotResult(item.jobDemand)
                );
                item.dotDescription = this._assessmentServ.decodeDotCategory(
                  this._assessmentServ.decodeDotResult(item.jobDemand)
                );
              }
            }
          });
        } else {
          this.getElementNames(this.jobTitle);
        }
      });
  }
  getClient() {
    this.isLoading = true;
    this.clientService.getDetail(this.clientId)
      .pipe((finalize(() => {
        this.line1 = this.client.address ? this.client.address.line1 : '';
        this.line2 = this.client.address ? this.client.address.line2 : '';
        this.city = this.client.address ? this.client.address.city : '';
        this.postalCode = this.client.address ? this.client.address.postalCode : '';
        this.province = this.client.address ? this.client.address.province : '';
        this.dateOfInjury = this.client.dateOfInjury ? this.client.dateOfInjury.toDate() : '';
        this.courtDate = this.client.courtDate ? this.client.courtDate.toDate() : '';
        this.isLoading = false;
      })))
      .subscribe((result) => {
        this.client = result;
        this.fullName = result.firstName + ' ' + result.lastName;
        this.addressId = result.addressId;
        this.isLoading = false;
        this.bookings = result.bookings;
        const bookings: Booking[] = this.bookings.filter(x => x.eventId === 1);
        if (bookings.length > 1) {
          this.assessmentDate = bookings[bookings.length - 1].startTime ? bookings[bookings.length - 1].startTime.toDate() : '';
        } else if (bookings.length == 1) {
          this.assessmentDate = bookings[0].startTime ? bookings[0].startTime.toDate() : '';
        }
      });
  }
  getContacts() {
    this.isLoading = true;
    this._lawFirmService.getContacts(this.client.lawFirmId)
      .subscribe((result) => {
        this.contacts = result.items;
      });
  }
  getAttorneys() {
    this._lawFirmService.getAttorneys(this.client.lawFirmId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe((result) => {
        this.attorneys = result.items;
      });
  }
  openCameraModal() {
    this.takePhoto.open();
  }
  injuryDateChanged(ctrl) {
    this.dateOfInjury = ctrl.value;
  }
  courtDateChanged(crtl) {
    this.courtDate = crtl.value;
  }
  save() {
    this.isLoading = true;
    this.client.address = new CreateAddressInput();
    this.client.address.line1 = this.line1;
    this.client.address.line2 = this.line2;
    this.client.address.city = this.city;
    this.client.address.postalCode = this.postalCode;
    this.client.address.province = this.province;
    this.client.dateOfInjury = this.dateOfInjury;
    this.client.courtDate = this.courtDate;
    this.client.assessmentDate = this.assessmentDate;
    if (this.addressId !== 0) {
      this.client.addressId = this.addressId;
    }
    let hoursDiff;
    let minutesDiff;
    // set Date of injury
    if (this.dateOfInjury !== null && this.dateOfInjury !== 'undefined' && !this.isValidDate(this.dateOfInjury)) {
      this.dateOfInjury = new Date(this.dateOfInjury);
      hoursDiff = this.dateOfInjury.getHours() - this.dateOfInjury.getTimezoneOffset() / 60;
      minutesDiff = (this.dateOfInjury.getHours() - this.dateOfInjury.getTimezoneOffset()) % 60;
      this.dateOfInjury.setHours(hoursDiff);
      this.dateOfInjury.setMinutes(minutesDiff);
    } else {
      this.dateOfInjury = '';
    }
    this.client.dateOfInjury = this.dateOfInjury;
    // set Court date
    if (this.courtDate !== null && this.courtDate !== 'undefined' && !this.isValidDate(this.courtDate)) {
      this.courtDate = new Date(this.courtDate);
      hoursDiff = this.courtDate.getHours() - this.courtDate.getTimezoneOffset() / 60;
      minutesDiff = (this.courtDate.getHours() - this.courtDate.getTimezoneOffset()) % 60;
      this.courtDate.setHours(hoursDiff);
      this.courtDate.setMinutes(minutesDiff);

    } else {
      this.courtDate = '';
    }
    this.client.courtDate = this.courtDate;
    // set Assessment date
    if (this.assessmentDate !== null && this.assessmentDate !== 'undefined' && !this.isValidDate(this.assessmentDate)) {
      this.assessmentDate = new Date(this.assessmentDate);
      hoursDiff = this.assessmentDate.getHours() - this.assessmentDate.getTimezoneOffset() / 60;
      minutesDiff = (this.assessmentDate.getHours() - this.assessmentDate.getTimezoneOffset()) % 60;
      this.assessmentDate.setHours(hoursDiff);
      this.assessmentDate.setMinutes(minutesDiff);
    } else {
      this.assessmentDate = '';
    }
    this.client.assessmentDate = this.assessmentDate;
    this.clientService.editClient(this.client)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(() => {
        this.notify.success('Updated Successfully');
        this.clientForm.reset(this.client);
        this.getClient();
        this.isLoading = false;
      }, error => {
        console.log(error);
        this.isLoading = false;
      });
  }
  resendEmail() {
    abp.message.confirm(
      'Are You Sure You Want to Send This Email ?',
      (result: boolean) => {
        if (result) {
          this.isLoading = true;
          this.clientService.resendEmail(this.clientId, this.client.contactId, location.origin)
            .pipe(finalize(() => {
              this.isLoading = false;
              abp.notify.success('Email Sent Successfully');
            })).subscribe(() => {
            });
        }
      }
    );

  }
  isValidDate(d) {
    const s = Date.parse(d);
    return isNaN(s);
  }
  updateWorkHistory() {
    this.clientService.editWorkHistory(this.workHistory)
      .pipe(finalize(() => { }))
      .subscribe(() => {
        this.notify.success('Updated Successfully');
      });
  }
  updateMedicalHistory() {
    this.clientService.editMedicalHistory(this.medicalHistory)
      .pipe(finalize(() => { }))
      .subscribe(() => {
        this.notify.success('Updated Successfully');
      });
  }
  getAge() {
    const idNumber: string = '' + this.client.idNumber;
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
  getGender() {
    const idNumber = '' + this.client.idNumber;
    const genderIdentifier = idNumber.charAt(6);
    if (Number.parseInt(genderIdentifier) < 5) {
      return 'Female';
    }
    return 'Male';
  }
  setFormTouched(clientForm: NgForm) {
    clientForm.control.markAsDirty();
  }
  getSelectedAssessments(categoryId: string) {
    this.selectedAssessments = [];
    this.isLoading = true;
    if (categoryId != null) {
      this._assessmentService.getSelectedAssessments(this.clientId, categoryId)
        .pipe(finalize(() => {
          this.isLoading = false;
        }))
        .subscribe(assessments => {
          this.selectedAssessments = assessments.items;
        });
    }
  }
  viewPhysicalAssessments(assessmentName: string, assessmentId: string) {
    switch (assessmentName) {
      case 'Gait':
        this.getGait();
        break;
      case 'Muscle Power':
        this.getMusclePower();
        break;
      case 'Grip Strength':
        this.getGripStrength();
        break;
      case 'Berg Balance':
        this.getBorgBalance();
        break;
      case 'Posture':
        this.getPosture(assessmentId);
        break;
      case 'Range Of Motion':
        this.getRangeOfMotion();
        break;
      case 'Sensation':
        this.getSensation();
        break;
      case 'Repetitive Tolerance':
        this.getRepetitiveToleranceProtocol();
        break;
      case 'Coordination':
        this.getCoordination();
        break;
      case 'Affect':
        this.getAffect();
        break;
      case 'Mobility':
        this.getMobility();
        break;
    }
  }

  changeAssessmentTabs(event: MatTabChangeEvent) {
    // console.log(event.index);
    switch (event.index) {
      case 0:
        this.isLoading = true;
        const physical = this.assessmentCategories.filter(x => x.name.includes('PHYSICAL'))[0];
        if (physical != null && physical.id != null) {
          this.getSelectedAssessments(physical.id);
        }
        break;
      case 1:
        this.getCogntiveAssessments();
        break;
      case 2:
        this.isLoading = true;
        this.getQuestionnaires();
        break;
      case 3:
        this.isLoading = true;
        this.getWorkInformation();
        break;
      default:
        break;
    }
  }
  handleTabChange(event: MatTabChangeEvent) {
    switch (event.index) {
      case 0:
        break;
      case 1:
        this.getContacts();
        this.getAttorneys();
        break;
      case 2:
        break;
      case 3:
        this.getFileData();
        this.getChildDocuments();
        break;
      case 4:
        const physical = this.assessmentCategories.filter(x => x.name.includes('PHYSICAL'))[0];
        if (physical != null && physical.id != null) {
          this.getSelectedAssessments(physical.id);
        }
        break;
      default:
        break;
    }
  }
  upload(event) {
    this.isUploading = true;
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(`/profilePics/${id}`);
    this.task = this.ref.putString(event, 'data_url');
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges()
      .pipe(finalize(() => {
        this.downloadURL = this.ref.getDownloadURL();
        this.downloadURL.subscribe((res) => {
          this.clientService.updateProfilePic(this.clientId, res)
            .pipe(finalize(() => {
              this.photoUrl = res;
              this.isUploading = false;
              this.client.profilePictureId = res;
              this.notify.success('Profile Pic Updated Successfully');
            })).subscribe(() => {
            });
        });
      })).subscribe(() => {

      });
  }
  deleteDocument(node: any) {
    abp.message.confirm(
      'Delete Document ' + node.name + ' ?',
      (result: boolean) => {
        if (result) {
          this.documentService.delete(node.id).pipe(finalize(() => {
            abp.notify.success('Deleted Document: ' + node.name);
            this.getFileData();
          }))
            .subscribe(() => {

            });
        }
      }
    );

  }
  loadList() {
    this.getQuestionnaires();
  }
  getGripStrength() {
    this.openGripStrength.open();
  }
  getMusclePower() {
    this.openMusclePower.open();
  }
  getRangeOfMotion() {
    this.openRoM.open();
  }
  getBorgBalance() {
    this.openBorgBalance.open();
  }
  getSensation() {
    this.openSensation.open();
  }
  getCoordination() {
    this.openCoordination.open();
  }
  getPosture(assessmentId: string) {
    this.openPosture.open(assessmentId);
  }
  getRepetitiveToleranceProtocol() {
    this.openRTP.open();
  }
  getGait() {
    this.openGait.open();
  }
  getMobility() {
    this.openMobility.open();
  }
  getAffect() {
    this.openAffect.open();
  }
  addQuestionnaire() {
    this.addQestionnaire.open();
  }
  /**
   * Open Cognitive assessemnt modals
  **/
  getCogntiveAssessments() {
    const cognitive = this.assessmentCategories.filter(x => x.name.includes('COGNITIVE'))[0];
    if (cognitive != null && cognitive.id != null) {
      this.categoryId = cognitive.id;
      // this.getSelectedAssessments(cognitive.id);
      this.cognitiveAssessments.show(cognitive.id);
    }

  }

  createQuestionnaire(type, description) {
    this.questionnaireType = type;
    this.questionnaireDescription = description;
    this.questionnaire.open(type);
  }

  getQuestionnaires() {
    this.isLoading = true;
    this._functionAssessmentService.getQuestionnaires(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(result => {
        this.questionnairesDto = result.items;
        console.log(this.questionnairesDto);
        const tempQuestionnaires = [];
        this.questionnairesDto.forEach((questionnaire) => {
          if (this.questionnaires.filter(x => x.type === questionnaire.type).length > 0) {
            const question = this.questionnaires.filter(x => x.type === questionnaire.type)[0];
            question.status = questionnaire.status;
            tempQuestionnaires.push(question);
          }
        });
        this.questionnaires = tempQuestionnaires;

      });
  }
  getElementNames(keyword) {
    this.ageList = [];
    this.maxDataValues = [];
    this.isLoading = true;
    this._workAssessmentService.getWorkContext(keyword)
      .pipe(finalize(() => {
        this.isLoading = false;
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
              if (item.jobDemand.includes('NIL') && !item.result.includes('NIL')) {
                item.isDeficit = 'Yes';
              } else if (item.jobDemand.includes('CONSTANT') && !item.result.includes('CONSTANT') &&
                !item.result.includes('NIL')) {
                item.isDeficit = 'Yes';
              } else if (item.jobDemand.includes('FREQUENT') && !item.result.includes('FREQUENT')
                && !item.result.includes('CONSTANT') && !item.result.includes('NIL')) {
                item.isDeficit = 'Yes';
              } else if (item.jobDemand.includes('OCCASIONAL') && item.result.includes('RARE')) {
                item.isDeficit = 'Yes';
              } else if (item.jobDemand.includes('RARE') && !item.result.includes('CONSTANT') &&
                !item.result.includes('NIL') && !item.result.includes('FREQUENT')
                && !item.result.includes('OCCASIONAL') && !item.result.includes('RARE')) {
                item.isDeficit = 'Yes';
              } else {
                item.isDeficit = 'No';
              }

            });
          }
          if (this.weightedProtocolResult != null && this.weightedProtocolResult.length > 0) {
            this.weightedProtocolTables = this.weightedProtocolResult.map(value => {
              return {
                id: value.targetId,
                activity: value.assessmentName,
                result: value.result,
                onetDescription: 'N/A',
                dotDescription: 'N/A',
                jobDemand: value.jobDemand
              };
            });
            this.weightedProtocolTables.forEach((item) => {
              let element: MaxDataValue;
              if (item.activity.includes('Lifting')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.g')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.onetDescription = this._assessmentServ.decodeOnetCategory(element.category);
                  item.dotDescription = this._assessmentServ.decodeDotCategory(element.category);
                }
              } else if (item.activity.includes('Unilateral')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.g')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.onetDescription = this._assessmentServ.decodeOnetCategory(element.category);
                  item.dotDescription = this._assessmentServ.decodeDotCategory(element.category);
                }
              } else if (item.activity.includes('Pushing')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.h')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.onetDescription = this._assessmentServ.decodeOnetCategory(element.category);
                  item.dotDescription = this._assessmentServ.decodeDotCategory(element.category);
                }
              } else if (item.activity.includes('Pulling')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.h')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.onetDescription = this._assessmentServ.decodeOnetCategory(element.category);
                  item.dotDescription = this._assessmentServ.decodeDotCategory(element.category);
                }
              } else if (item.activity.includes('Bilateral')) {
                element = this.maxDataValues.filter(x => x.elementId === '4.C.2.d.1.g')[0];
                if (element != null && typeof element !== 'undefined') {
                  item.onetDescription = this._assessmentServ.decodeOnetCategory(element.category);
                  item.dotDescription = this._assessmentServ.decodeDotCategory(element.category);
                }
              }
            });
          }
          if (this.repetitiveToleranceResult != null && this.repetitiveToleranceResult.length > 0) {
            this.repetitiveToleranceResult.forEach((item) => {
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
              if (item.jobDemand.includes('NIL') && !item.result.includes('NIL')) {
                item.isDeficit = 'Yes';
              } else if (item.jobDemand.includes('CONSTANT') && !item.result.includes('CONSTANT') &&
                !item.result.includes('NIL')) {
                item.isDeficit = 'Yes';
              } else if (item.jobDemand.includes('FREQUENT') && !item.result.includes('FREQUENT')
                && !item.result.includes('CONSTANT') && !item.result.includes('NIL')) {
                item.isDeficit = 'Yes';
              } else if (item.jobDemand.includes('OCCASIONAL') && item.result.includes('RARE')) {
                item.isDeficit = 'Yes';
              } else if (item.jobDemand.includes('RARE') && !item.result.includes('RARE')) {
                item.isDeficit = 'Yes';
              } else {
                item.isDeficit = 'No';
              }
            });
          }
        }
      });
  }

  showComment(id: string, activity: string) {
    // this.cognitiveComment.show();
    this.dialog.open(WorkAssessmentComponent, {
      hasBackdrop: false,
      data: { id: id, fullName: this.fullName, clientId: this.clientId, activity: activity },
      width: '650px'
    });
  }
  hasChild = (_: number, node: FolderNode) => !!node.children && node.children.length > 0;
}
