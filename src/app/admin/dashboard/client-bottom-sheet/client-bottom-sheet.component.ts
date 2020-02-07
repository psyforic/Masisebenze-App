import { Component, OnInit, Inject, Injector, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientServiceProxy, CreateClientInput } from '@shared/service-proxies/service-proxies';
import { MAT_BOTTOM_SHEET_DATA, MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MatBottomSheetRef } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import * as moment from 'moment';

@Component({
  selector: 'app-client-bottom-sheet',
  templateUrl: './client-bottom-sheet.component.html',
  styleUrls: ['./client-bottom-sheet.component.scss'],
  providers: [
    ClientServiceProxy,
    { provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: { hasBackdrop: true} }]
})
export class ClientBottomSheetComponent extends AppComponentBase implements OnInit {

  @Output() clientAdded = new EventEmitter();
  clientForm: FormGroup;
  clientInput: CreateClientInput = new CreateClientInput();
  isSaving = false;
  date: any;
  startTime: any;
  endTime: any;
  constructor(
    private injector: Injector,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private clientService: ClientServiceProxy,
    private bottomSheetRef: MatBottomSheetRef,
    private fb: FormBuilder) {
    super(injector);
  }

  ngOnInit() {
    this.date = this.data.date;
    console.log(this.date);
    this.initializeForm();
  }
  initializeForm() {
    this.clientForm = this.fb.group({
      courtDate: [''],
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      idNumber: ['', [Validators.required, Validators.maxLength(13), Validators.minLength(13)]],
      assessmentDate: [this.date, Validators.required]
    });
  }
  close() {
    this.bottomSheetRef.dismiss();
  }
  setStartTime(event) {
    this.startTime = event;
  }
  setEndTime(event) {
    this.endTime = event;
  }
  save() {
    if (this.data.lawFirmId === '' || this.data.attorneyId === '' || this.data.contactId === '') {
      this.notify.error('Form Not Valid Check Your Event Form');
      return;
    }
    this.isSaving = true;
    this.clientInput = Object.assign({}, this.clientForm.value);
    this.clientInput.lawFirmId = this.data.lawFirmId;
    this.clientInput.attorneyId = this.data.attorneyId;
    this.clientInput.contactId = this.data.contactId;
    this.clientInput.startTime = moment(this.date + ' ' + this.startTime + '+0000', 'YYYY-MM-DD HH:mm Z');
    this.clientInput.endTime = moment(this.date + ' ' + this.endTime + '+0000', 'YYYY-MM-DD HH:mm Z');
    let hoursDiff;
    let minutesDiff;
    if (this.date !== null && this.date !== 'undefined') {
      this.date = new Date(this.date);
      hoursDiff = this.date.getHours() - this.date.getTimezoneOffset() / 60;
      minutesDiff = (this.date.getHours() - this.date.getTimezoneOffset()) % 60;
      this.date.setHours(hoursDiff);
      this.date.setMinutes(minutesDiff);
      this.clientInput.assessmentDate = this.date;
    }
    this.clientService.createClient(this.clientInput)
      .pipe(finalize(() => {
        this.isSaving = false;
        this.close();
      })).subscribe(() => {
        this.notify.success('Client Added Successfully\nAnd Also a new Assessment Booking has been created.');
      });
  }
}
