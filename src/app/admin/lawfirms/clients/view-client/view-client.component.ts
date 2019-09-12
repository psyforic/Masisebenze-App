import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
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
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';

interface DocumentNode {
  name: string;
  children?: DocumentNode[];
}
/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
@Component({
  selector: 'kt-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss'],
  providers: [ClientServiceProxy, DocumentServiceProxy]
})
export class ViewClientComponent extends AppComponentBase implements OnInit {

  client: ClientDetailOutput = new ClientDetailOutput();
  documents: DocumentListDto[] = [];
  workHistory: WorkHistoryDetailOutput = new WorkHistoryDetailOutput();
  medicalHistory: MedicalHistoryDetailOutput = new MedicalHistoryDetailOutput();;
  clientId = '';
  line1 = '';
  line2 = '';
  city = '';
  province = '';
  addressId = 0;
  postalCode = '';
  blured = false;
  focused = false;
  isWorkUpdate = false;
  isMedicalUpdate = false;
  panelOpenState = false;
  isUploading = false;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;
  uploadState: Observable<string>;
  currentHistory = '';
  constructor(private injector: Injector,
    private clientService: ClientServiceProxy,
    private documentService: DocumentServiceProxy,
    private route: ActivatedRoute,
    private afStorage: AngularFireStorage,
  ) {
    super(injector);
    this.route.paramMap.subscribe((paramMap) => {
      this.clientId = paramMap.get('id');

    });

    // this.fileDataSource.data = TREE_DATA;
  }
  getFileData() {
    this.documentService.getClientDocuments(this.clientId)
      .pipe(finalize(() => { }))
      .subscribe((result) => {
        this.documents = result.items;
        const filtered = this.documents.map((value) => {
          return { name: value.name, children: [{ name: value.fileUrl }] };
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
  }
  getClient() {
    this.clientService.getDetail(this.clientId)
      .pipe((finalize(() => {
        this.line1 = this.client.address.line1;
        this.line2 = this.client.address.line2;
        this.city = this.client.address.city;
        this.postalCode = this.client.address.postalCode;
        this.province = this.client.address.province;
      })))
      .subscribe((result) => {
        this.client = result;
        this.addressId = result.addressId;
      });
  }
  created(event) {
    // tslint:disable-next-line:no-console
    console.log('editor-created', event);
  }

  changedEditor(event) {
    // tslint:disable-next-line:no-console
    console.log('editor-change', event);
  }

  focus($event) {
    // tslint:disable-next-line:no-console
    console.log('focus', $event);
    this.focused = true;
    this.blured = false;
  }

  blur($event) {
    // tslint:disable-next-line:no-console
    console.log('blur', $event);
    this.focused = false;
    this.blured = true;
  }
  save() {
    this.client.address = new CreateAddressInput();
    this.client.address.line1 = this.line1;
    this.client.address.line2 = this.line2;
    this.client.address.city = this.city;
    this.client.address.postalCode = this.postalCode;
    this.client.address.province = this.province;
    if (this.addressId !== 0) {
      this.client.addressId = this.addressId;
    }
    this.clientService.editClient(this.client)
      .pipe(finalize(() => { }))
      .subscribe(() => {
        this.notify.success('Saved Successfully');
        this.getClient();
      });
  }
  updateWorkHistory() {
    this.clientService.editWorkHistory(this.workHistory)
      .pipe(finalize(() => { }))
      .subscribe(() => {
        this.notify.success('Saved Successfully');
      });
  }
  updateMedicalHistory() {
    this.clientService.editMedicalHistory(this.medicalHistory)
      .pipe(finalize(() => { }))
      .subscribe(() => {
        this.notify.success('Saved Successfully');
      });
  }
  onContentChanged = (event) => {
    console.log(event);
  }
  upload(event) {
    this.isUploading = true;
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(`/profilePics/${id}`);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges()
      .pipe(finalize(() => {
        this.downloadURL = this.ref.getDownloadURL();
        this.downloadURL.subscribe((res) => {
          this.client.profilePictureId = res;
          this.clientService.editClient(this.client)
            .pipe(finalize(() => { }))
            .subscribe(() => {
              this.notify.success('Profile Pic Updated Successfully');
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
