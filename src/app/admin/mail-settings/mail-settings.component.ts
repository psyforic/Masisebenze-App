import { Location, PlatformLocation } from '@angular/common';
import { MailSettingsInput, MailSettingsDto } from './../../../shared/service-proxies/service-proxies';
import { AccountServiceProxy } from '@shared/service-proxies/service-proxies';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, Injector } from '@angular/core';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-mail-settings',
  templateUrl: './mail-settings.component.html',
  styleUrls: ['./mail-settings.component.scss']
})
export class MailSettingsComponent extends AppComponentBase implements OnInit {

  mailSettingsForm: FormGroup;
  mailSettingsInput: MailSettingsInput = new MailSettingsDto();
  mailSettings: MailSettingsDto = new MailSettingsDto();
  isLoading = false;
  isSent = false;
  constructor(
    injector: Injector,
    private _fb: FormBuilder,
    private location: Location,
    private platformLocation: PlatformLocation,
    private _accountService: AccountServiceProxy) {
    super(injector);
  }

  ngOnInit() {
    this.initializeForm();
    this.getMailSettings();
  }
  backClicked() {
    this.location.back();
  }
  initializeForm() {
    this.mailSettingsForm = this._fb.group({
      displayName: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      host: ['', Validators.required],
      port: ['', Validators.required]
    });
  }
  getMailSettings() {
    this.isLoading = true;
    this._accountService.getMailSettings()
      .pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe((result) => {
        this.mailSettings = result;
        if (result != null && result !== undefined) {
          this.mailSettingsForm.patchValue(result);
        }
      });
  }
  sendTestMail() {
    this._accountService.sendTestEmail()
      .pipe(finalize(() => {
        this.notify.success('Test Mail Sent');
      })).subscribe(() => {
        this.isSent = true;
      });
  }
  save() {
    this.isLoading = true;
    this.mailSettingsInput = Object.assign({}, this.mailSettingsForm.value);
    this._accountService.connect(this.mailSettingsInput)
      .pipe(finalize(() => {
        this.isLoading = false;
        this.notify.success('Mail Settings Updated Successfully');
      })).subscribe(() => {
        this.isSent = true;
      });
  }
}
