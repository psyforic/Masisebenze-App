import { Component, OnInit, Inject, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ClientServiceProxy, CreateClientInput } from '@shared/service-proxies/service-proxies';
import { MAT_BOTTOM_SHEET_DATA, MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MatBottomSheetRef } from '@angular/material';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-client-bottom-sheet',
  templateUrl: './client-bottom-sheet.component.html',
  styleUrls: ['./client-bottom-sheet.component.scss'],
  providers: [ClientServiceProxy, { provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }]
})
export class ClientBottomSheetComponent extends AppComponentBase implements OnInit {

  clientForm: FormGroup;
  clientInput: CreateClientInput = new CreateClientInput();
  isSaving = false;
  constructor(
    private injector: Injector,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private clientService: ClientServiceProxy,
    private bottomSheetRef: MatBottomSheetRef,
    private fb: FormBuilder) {
    super(injector);
  }

  ngOnInit() {
    console.log(this.data);
    this.initializeForm();
  }
  initializeForm() {
    this.clientForm = this.fb.group({
      courtDate: ['', Validators.required],
      title: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      idNumber: ['', [Validators.required, Validators.maxLength(13), Validators.minLength(13)]],
      assessmentDate: ['', Validators.required]
    });
  }
  close() {
    this.bottomSheetRef.dismiss();
  }
  save() {
    if (this.data.lawFirmId === '' || this.data.attorneyId === '' || this.data.contactId === '') {
      this.notify.error('Form Not Valid Not All Check Your Event Form');
      return;
    }
    this.isSaving = true;
    this.clientInput = Object.assign({}, this.clientForm.value);
    this.clientInput.lawFirmId = this.data.lawFirmId;
    this.clientInput.attorneyId = this.data.attorneyId;
    this.clientInput.contactId = this.data.contactId;
    this.clientService.createClient(this.clientInput)
      .pipe(finalize(() => {
        this.isSaving = false;
        this.close();
      })).subscribe(() => {
        this.notify.success('Client Added Successfully');
      });
  }
}