import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  ClientServiceProxy,
  ClientDetailOutput,
  WorkHistoryDetailOutput,
  MedicalHistoryDetailOutput,
  DocumentServiceProxy,
  DocumentListDto,
  CreateAddressInput
} from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { finalize, map } from 'rxjs/operators';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource, MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { CameraModalComponent } from '../camera-modal/camera-modal.component';
import { GeneralService } from '@app/admin/services/general.service';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
declare const $: any;
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
  parentDocId?: number;
  children?: DocumentNode[];
}
/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  parentId?: number;
}
@Component({
  selector: 'kt-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss'],
  providers: [ClientServiceProxy, DocumentServiceProxy,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE], useValue: { useUtc: true } },

    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_Format }]
})
export class ViewClientComponent extends AppComponentBase implements OnInit {

  @ViewChild('newPhoto', { static: false }) takePhoto: CameraModalComponent;
  client: ClientDetailOutput = new ClientDetailOutput();
  documents: DocumentListDto[] = [];
  workHistory: WorkHistoryDetailOutput = new WorkHistoryDetailOutput();
  medicalHistory: MedicalHistoryDetailOutput = new MedicalHistoryDetailOutput();
  clientId = '';
  line1 = '';
  line2 = '';
  city = '';
  province = '';
  addressId = 0;
  postalCode = '';
  panelOpenState = false;
  isUploading = false;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;
  currentHistory = '';
  uploadedImage = '';
  photoUrl: string;
  dateOfInjury: string;
  courtDate = '';
  assessmentDate = '';

  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  constructor(private injector: Injector,
    private clientService: ClientServiceProxy,
    private documentService: DocumentServiceProxy,
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
    this.documentService.getClientDocuments(this.clientId)
      .pipe(finalize(() => { }))
      .subscribe((result) => {
        this.documents = result.items;
        const filtered = this.documents.map((value) => {
          return {
            name: value.name, url: value.fileUrl,
            children: [{ name: value.name, url: value.fileUrl, parentId: value.parentDocId },
            { name: value.name, url: value.fileUrl, parentId: value.parentDocId }],
            parentId: value.parentDocId
          };
        });
        this.fileDataSource.data = filtered;
      });
  }
  ngOnInit() {
    this.getClient();
    this.getFileData();
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
  getClient() {
    this.clientService.getDetail(this.clientId)
      .pipe((finalize(() => {
        this.line1 = this.client.address.line1;
        this.line2 = this.client.address.line2;
        this.city = this.client.address.city;
        this.postalCode = this.client.address.postalCode;
        this.province = this.client.address.province;
        this.dateOfInjury = moment(this.client.dateOfInjury).format('YYYY-MM-DD');
        this.courtDate = moment(this.client.courtDate).format('YYYY-MM-DD');
        this.assessmentDate = moment(this.client.assessmentDate).format('YYYY-MM-DD');
      })))
      .subscribe((result) => {
        this.client = result;
        this.addressId = result.addressId;
      });
  }

  openCameraModal() {
    this.takePhoto.open();
  }
  save() {
    this.client.address = new CreateAddressInput();
    this.client.address.line1 = this.line1;
    this.client.address.line2 = this.line2;
    this.client.address.city = this.city;
    this.client.address.postalCode = this.postalCode;
    this.client.address.province = this.province;
    // const injuryDate = $('#dateValue').val();
    // const courtDate = new Date($('#courtDateValue').val());
    const newDate = new Date(this.dateOfInjury);
    newDate.setDate(newDate.getDate() + 1);
    const formattedInjuryDate = moment(newDate).toLocaleString();
    // const formattedCourtDate = moment(courtDate).format('YYYY/MM/DD');
    this.client.dateOfInjury = moment(formattedInjuryDate);
    // this.client.courtDate = moment(formattedCourtDate);
    if (this.addressId !== 0) {
      this.client.addressId = this.addressId;
    }
    this.clientService.editClient(this.client)
      .pipe(finalize(() => { }))
      .subscribe(() => {
        this.notify.success('Updated Successfully');
        this.getClient();
      });
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
  onContentChanged = (event) => {
  }
  setFormTouched(clientForm: NgForm) {
    clientForm.control.markAsDirty();
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
  private _transformer = (node: DocumentNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      url: node.url
    };
  }
  // tslint:disable-next-line:member-ordering
  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);
  // tslint:disable-next-line:member-ordering
  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);
  // tslint:disable-next-line: member-ordering
  fileDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  // tslint:disable-next-line:member-ordering
  hasChild = (_: number, node: FlatNode) => node.expandable;
}
