import { registerLocaleData } from '@angular/common';
import { Document } from 'docx';
import { DocumentFolder } from './../../../documents/document-types';
import { DocumentsModule } from './../../../documents/documents.module';
import { Event, DocumentListDto } from './../../../../../shared/service-proxies/service-proxies';
import { NestedTreeControl, FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { NgForm } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatTreeNestedDataSource,
  MatTabChangeEvent
} from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
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
import * as moment from 'moment';
import { Observable, of, from } from 'rxjs';
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
import { groupBy, mergeMap, reduce } from 'rxjs/operators';
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
interface DocumentNode {
  name: string;
  url?: string;
  id: number;
}
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
interface FolderNode {
  id: number;
  value: string;
  children?: any[];
}
@Component({
  selector: 'kt-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss'],
  providers: [ClientServiceProxy, DocumentServiceProxy, LawFirmServiceProxy]
})
export class ViewClientComponent extends AppComponentBase implements OnInit {

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
  hidden = true;
  constructor(injector: Injector,
    private clientService: ClientServiceProxy,
    private documentService: DocumentServiceProxy,
    private _lawFirmService: LawFirmServiceProxy,
    private route: ActivatedRoute,
    private afStorage: AngularFireStorage,
    private generalService: GeneralService
  ) {
    super(injector);
    this.route.paramMap.subscribe((paramMap) => {
      this.clientId = paramMap.get('id');
    });
  }
  getFileData() {
    this.documentService.getClientDocuments(this.clientId).subscribe(
      (result) => {
        this.documents = result.items;
        if (this.documents != null && this.documents.length > 0) {
          const filtered = this.documentTypes.map((type) => {
            return {
              value: type.value,
              id: type.id,
              children: this.documents.filter(x => x.parentDocId == type.id).map(
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
        }  else {
          const filtered = this.documentTypes.map((type) => {
            return {
              value: type.value,
              id: type.id,
              children: []
            };
          });
          this.dataSource.data = filtered.filter(x => x.children.length > 0);
        }
        // sconsole.log(this.dataSource.data);
      }

    );

  }
  getDoc(id): DocumentListDto[]  {
    let docs:DocumentListDto[] = [];
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
    this.getClient();
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
  getDocuments(documentId: number) {
    return this.childDocuments.filter(x => x.parentDocId === documentId);
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
        this.assessmentDate = this.client.assessmentDate ? this.client.assessmentDate.toDate() : '';
        this.isLoading = false;
      })))
      .subscribe((result) => {
        this.client = result;
        this.fullName = result.firstName + ' ' + result.lastName;
        this.addressId = result.addressId;
        this.isLoading = false;
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
  injuryDateChanged(event, ctrl) {
    this.dateOfInjury = ctrl.value;
  }
  courtDateChanged(event, crtl) {
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
      hoursDiff = this.dateOfInjury.getHours() - this.courtDate.getTimezoneOffset() / 60;
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
    // console.log(this.client.courtDate);
    // console.log(this.client.dateOfInjury);
    // console.log(this.client.assessmentDate);
    this.clientService.editClient(this.client)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(() => {
        this.notify.success('Updated Successfully');
        this.getClient();
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
      });
  }
  isValidDate(d) {
    let s = Date.parse(d)
    return isNaN(s) == true;
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
  hasChild = (_: number, node: FolderNode) => !!node.children && node.children.length > 0;
}
