import { Component, OnInit, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  ClientServiceProxy,
  ClientDetailOutput,
  WorkHistoryDetailOutput,
  CreateMedicalHistoryInput,
  MedicalHistoryDetailOutput,
  CreateWorkHistoryInput
} from '@shared/service-proxies/service-proxies';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'kt-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss'],
  providers: [ClientServiceProxy]
})
export class ViewClientComponent extends AppComponentBase implements OnInit {

  client: ClientDetailOutput = new ClientDetailOutput();
  workHistory: any;
  medicalHistory: any;
  clientId: string;
  line1: string;
  line2: string;
  city: string;
  province: string;
  addressId = 0;
  postalCode: string;
  blured = false;
  focused = false;
  isWorkUpdate = false;
  isMedicalUpdate = false;
  panelOpenState = false;
  constructor(private injector: Injector,
    private clientService: ClientServiceProxy,
    private route: ActivatedRoute
  ) {
    super(injector);
    this.route.paramMap.subscribe((paramMap) => {
      this.clientId = paramMap.get('id');

    });
  }

  ngOnInit() {
    this.getClient();
    this.clientService.getMedicalHistoryByClientId(this.clientId)
      .pipe(finalize(() => {
        if (this.medicalHistory.hasOwnProperty('id')) {
          this.isMedicalUpdate = false;
          console.log(this.isWorkUpdate);
        } else {
          this.isMedicalUpdate = true;
          console.log(this.isWorkUpdate);
        }
      }))
      .subscribe((result) => {
        if (!result) {
          this.medicalHistory = new CreateMedicalHistoryInput();
          this.isWorkUpdate = false;
        } else {
          this.medicalHistory = new MedicalHistoryDetailOutput();
          this.isWorkUpdate = true;
        }
      });
    this.clientService.getWorkHistoryByClientId(this.clientId)
      .pipe(finalize(() => {
        if (this.workHistory instanceof CreateWorkHistoryInput) {
          this.isWorkUpdate = false;
        } else {
          this.isWorkUpdate = true;
        }
      }))
      .subscribe((result) => {
        if (!result) {
          this.workHistory = new CreateWorkHistoryInput();
        } else {
          this.workHistory = new WorkHistoryDetailOutput();
        }
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
  saveWorkHistory() {
    this.clientService.createWorkHistory(this.workHistory)
      .pipe(finalize(() => { }))
      .subscribe(() => {
        this.notify.success('Saved Successfully');
      });
  }

  updateWorkHistory() {
    this.clientService.editWorkHistory(this.workHistory)
      .pipe(finalize(() => { }))
      .subscribe(() => {
        this.notify.success('Saved Successfully');
      });
  }
  saveMedicalHistory() {
    this.clientService.createMedicalHistory(this.medicalHistory)
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
}
