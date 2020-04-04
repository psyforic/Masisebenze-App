import { VirtualPerceptionComponent } from './../assessments/cognitive-assessments/virtual-perception/virtual-perception.component';
import { ReportSummaryComponent } from './report-summary/report-summary.component';
import { VisuoSpatialAbilityComponent } from './../assessments/cognitive-assessments/visuo-spatial-ability/visuo-spatial-ability.component';
import { VerbalFluencyComponent } from './../assessments/cognitive-assessments/verbal-fluency/verbal-fluency.component';
import { RegistrationComponent } from './../assessments/cognitive-assessments/registration/registration.component';
import { PerceptualAbilityComponent } from './../assessments/cognitive-assessments/perceptual-ability/perceptual-ability.component';
import { MemoryComponent } from './../assessments/cognitive-assessments/memory/memory.component';
import { LanguageComponent } from './../assessments/cognitive-assessments/language/language.component';
import { AttentionAndConcentrationComponent } from './../assessments/cognitive-assessments/attention-and-concentration/attention-and-concentration.component';
import { QuestionnaireCommentComponent } from './../assessments/functional-assessment/questionnaire-comment/questionnaire-comment.component';
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
  AssessmentsListListDto
} from './../../../../../shared/service-proxies/service-proxies';
import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Injector, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';
import {
  MatTreeNestedDataSource,
  MatTabChangeEvent
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
@Component({
  selector: 'kt-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss'],
  providers: [ClientServiceProxy, DocumentServiceProxy, WorkAssessmentServiceProxy,
    LawFirmServiceProxy, FunctionalAssessmentServiceProxy, WorkAssessmentReportServiceProxy,
    WorkInformationServiceProxy, AssessmentServiceProxy, StaticDataServiceProxy]
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
  @ViewChild('attentionAndConcentrationComponent', { static: false })
  openAttentionAndConcentrationComponent: AttentionAndConcentrationComponent;
  @ViewChild('languageComponent', { static: false })
  openLanguageComponent: LanguageComponent;
  @ViewChild('memoryComponent', { static: false })
  openMemoryComponent: MemoryComponent;
  @ViewChild('orientationComponent', { static: false })
  openOrientationComponent: MemoryComponent;
  @ViewChild('perceptualAbilityComponent', { static: false })
  openPerceptualAbilityComponent: PerceptualAbilityComponent;
  @ViewChild('registrationComponent', { static: false })
  openRegistrationComponent: RegistrationComponent;
  @ViewChild('verbalFulencyComponent', { static: false })
  openVerbalFliuencyComponent: VerbalFluencyComponent;
  @ViewChild('virtualPerceptionComponent', { static: false })
  openVirtualPerceptionComponent: VirtualPerceptionComponent;
  @ViewChild('visuoSpatialAbilityComponent', { static: false })
  openVisuoSpatialAbilityComponent: VisuoSpatialAbilityComponent;
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
  displayedColumns: string[] = ['activity', 'peformance', 'jobDemand', 'deficit'];
  weightedProtocolDisplayedColumns: string[] = ['activity', 'peformance', 'jobDemand', 'deficit'];
  maxDataValues: MaxDataValue[] = [];
  assessmentCategories: AssessmentCategoryDetailOutput[] = [];
  selectedAssessments: AssessmentsListListDto[] = [];
  jobTitle: string;
  hidden = true;
  bookings: Booking[] = [];
  questionnaires = [
    { type: 1, description: 'PATIENT HEALTH' },
    { type: 2, description: 'DEPRESSION' },
    { type: 3, description: 'ACTIVITIES OF DAILY LIVING' },
    { type: 4, description: 'INSTRUMENTAL ACTIVITIES OF DAILY LIVING' }
  ];
  questionnaireType: number;
  questionnaireDescription: string;
  constructor(injector: Injector,
    private clientService: ClientServiceProxy,
    private _functionAssessmentService: FunctionalAssessmentServiceProxy,
    private _assessmentService: AssessmentServiceProxy,
    private _staticDataService: StaticDataServiceProxy,
    private _workAssessmentReportService: WorkAssessmentReportServiceProxy,
    private _workAssessmentService: WorkAssessmentServiceProxy,
    private _workInfomationService: WorkInformationServiceProxy,
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
        this._workInfomationService.getByClientId(clientId)
          .pipe(finalize(() => {
          })).subscribe(workResult => {
            if (result != null && (workResult.jobTitle != null && workResult.jobTitle !== '' && workResult.jobTitle != 'undefined')) {
              this.positionalToleranceResult = result.filter(x => x.result != null && x.result !== '');
              this.getElementNames(workResult.jobTitle);
            }
          });
      });
  }
  getWeightedProtocolReport(clientId) {

    this._workAssessmentReportService.getWeightedProtocolReport(clientId)
      .pipe(finalize(() => {
      })).subscribe(result => {
        this._workInfomationService.getByClientId(clientId)
          .pipe(finalize(() => {
          })).subscribe(workResult => {
            if (result != null && (workResult.jobTitle != null &&
              workResult.jobTitle !== '' &&
              typeof workResult.jobTitle != 'undefined')) {
              this.jobTitle = workResult.jobTitle;
              this.weightedProtocolResult = result.filter(x => x.result != null && x.result !== '');
              this.getElementNames(workResult.jobTitle);
            } else {
              this.jobTitle = 'No job title found';
            }
          });
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
        } else {
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
          this.clientService.resendEmail(this.clientId, this.client.contactId)
            .pipe(finalize(() => {
              this.isLoading = false;
              abp.notify.success('Email Send Successfully');
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
          // console.log(assessments);
        });
    }
  }
  viewPhysicalAssessments(assessmentName: string) {
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
      case 'Borg Balance':
        this.getBorgBalance();
        break;
      case 'Posture':
        this.getPosture();
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
  viewCognitiveAssessments(assessmentName: string) {
    switch (assessmentName) {
      case 'Attention And Concentration':
        this.getAttentionAndConcentration();
        break;
      case 'Language':
        this.getLanguage();
        break;
      case 'Memory':
        this.getMemory();
        break;
      case 'Orientation':
        this.getOrientation();
        break;
      case 'Registration':
        this.getRegistration();
        break;
      case 'Perceptual Ability':
        this.getPerceptualAbility();
        break;
      case 'Visuo Spatial Ability':
        this.getVisuoSpatialAbility();
        break;
      case 'Verbal Fluency':
        this.getVerbalFluency();
        break;
      case 'Virtual Perception':
        this.getVitualPreception();
        break;
      case 'Comprehension':
        break;
      case 'Naming':
        break;
      case 'Repetition':
        break;
      case 'Reading':
        break;
      case 'Writing':
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
        this.isLoading = true;
        const cognitive = this.assessmentCategories.filter(x => x.name.includes('COGNITIVE'))[0];
        if (cognitive != null && cognitive.id != null) {
          this.getSelectedAssessments(cognitive.id);
        }
        break;
      case 2:
        this.isLoading = true;
        this.getQuestionnaires();
        break;
      case 3:
        this.isLoading = true;
        this.getWeightedProtocolReport(this.clientId);
        this.getPositionalToleranceReport(this.clientId);
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
        // this.assessmentCategories.filter(x => x.name.includes('PHY') || x.name.includes('COG') || 
        // x.name.includes('FUNC') || x.name.includes('WORK'));
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
  loadList(event) {
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
  getPosture() {
    this.openPosture.open();
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
  getAttentionAndConcentration() {
    this.openAttentionAndConcentrationComponent.open();
  }
  getLanguage() {
    this.openLanguageComponent.open();
  }
  getMemory() {
    this.openMemoryComponent.open();
  }
  getOrientation() {
    this.openOrientationComponent.open();
  }
  getPerceptualAbility() {
    this.openPerceptualAbilityComponent.open();
  }
  getRegistration() {
    this.openRegistrationComponent.open();
  }
  getVerbalFluency() {
    this.openVerbalFliuencyComponent.open();
  }
  getVisuoSpatialAbility() {
    this.openVisuoSpatialAbilityComponent.open();
  }
  getVitualPreception() {
    this.openVirtualPerceptionComponent.open();
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
        const tempQuestionnaires = [];
        this.questionnairesDto.forEach((questionnaire) => {
          if (this.questionnaires.filter(x => x.type === questionnaire.type).length > 0) {
            tempQuestionnaires.push(this.questionnaires.filter(x => x.type === questionnaire.type)[0]);
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
        //console.log(result)
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
                  // console.log(dataValues);
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
              if (item.jobDemand.includes('NIL') && !item.result.includes('NIL')) {
                item.isDeficit = 'Yes';
              } else if (item.jobDemand.includes('CONSTANT') && !item.result.includes('CONSTANT') && 
              !item.result.includes('NIL')) {
                item.isDeficit = 'Yes';
              } else if (item.jobDemand.includes('FREQUENT') && !item.result.includes('FREQUENT')
               && !item.result.includes('CONSTANT') && !item.result.includes('NIL')) {
                item.isDeficit = 'Yes';
              } else if (item.jobDemand.includes('OCCASSIONAL') && !item.result.includes('OCCASSIONAL') 
              && !item.result.includes('CONSTANT') &&
                !item.result.includes('NIL') && !item.result.includes('FREQUENT')) {
                item.isDeficit = 'Yes';
              } else if (item.jobDemand.includes('RARE') && !item.result.includes('CONSTANT') &&
                !item.result.includes('NIL') && !item.result.includes('FREQUENT')
                 && !item.result.includes('OCCASSIONAL')  && !item.result.includes('RARE')) {
                item.isDeficit = 'Yes';
              } else {
                item.isDeficit = 'No';
              }

            });
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
              if (item.jobDemand.includes('NIL') && !item.result.includes('NIL')) {
                item.isDeficit = 'Yes';
              } else if (item.jobDemand.includes('CONSTANT') && !item.result.includes('CONSTANT') && 
              !item.result.includes('NIL')) {
                item.isDeficit = 'Yes';
              } else if (item.jobDemand.includes('FREQUENT') && !item.result.includes('FREQUENT')
               && !item.result.includes('CONSTANT') && !item.result.includes('NIL')) {
                item.isDeficit = 'Yes';
              } else if (item.jobDemand.includes('OCCASSIONAL') && !item.result.includes('OCCASSIONAL') 
              && !item.result.includes('CONSTANT') &&
                !item.result.includes('NIL') && !item.result.includes('FREQUENT')) {
                item.isDeficit = 'Yes';
              } else if (item.jobDemand.includes('RARE') && !item.result.includes('CONSTANT') &&
                !item.result.includes('NIL') && !item.result.includes('FREQUENT')
                 && !item.result.includes('OCCASSIONAL')  && !item.result.includes('RARE')) {
                item.isDeficit = 'Yes';
              } else {
                item.isDeficit = 'No';
              }
            });
          }
        }
      });
  }
  hasChild = (_: number, node: FolderNode) => !!node.children && node.children.length > 0;
}
