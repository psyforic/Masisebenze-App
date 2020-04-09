import {
  ReportSummaryServiceProxy, ReportSummaryDto, ClientServiceProxy,
  ClientDetailOutput
} from '../../../../../../shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, Injector } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['./report-summary.component.scss'],
  providers: [ReportSummaryServiceProxy, ClientServiceProxy]
})
export class ReportSummaryComponent extends AppComponentBase implements OnInit {
  client: ClientDetailOutput = new ClientDetailOutput();
  summaryForm: FormGroup;
  clientId: string;
  isLoading = false;
  reportSummary: ReportSummaryDto = new ReportSummaryDto();
  constructor(
    injector: Injector,
    private _clientService: ClientServiceProxy,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _reportSummaryService: ReportSummaryServiceProxy,
    private _location: Location) {
    super(injector);
    this.route.paramMap.subscribe((paramMap) => {
      this.clientId = paramMap.get('id');
    });
  }
  ngOnInit() {
    this.initializeForm();
    this.getClient();
    this.getReportSummary();
  }
  initializeForm() {
    this.summaryForm = this.fb.group({
      discussion: [''],
      lossOfEmenities: [''],
      residualWorkCapacity: [''],
      recommendations: [''],
      futureMedicalExpenses: [''],
      futureMedicalAndSurgicalIntervention: [''],
      supplementaryHealthServices: [''],
      physiotherapy: [''],
      psychology: [''],
      occupationalTherapy: [''],
      specialEquipment: [''],
      caseManagement1: [''],
      transportationCosts: ['']
    });
  }
  backClicked() {
    this._location.back();
  }
  getClient() {
    this.isLoading = true;
    this._clientService.getDetail(this.clientId)
      .pipe((finalize(() => {
        this.isLoading = false;
      })))
      .subscribe((result) => {
        this.client = result;
      });
  }
  save() {
    this.isLoading = true;
    this.reportSummary.clientId = this.clientId;
    if (this.summaryForm.get('discussion') != null) {
      this.reportSummary.discussion = this.summaryForm.get('discussion').value;
    }
    if (this.summaryForm.get('caseManagement1') != null) {
      this.reportSummary.caseManagement1 = this.summaryForm.get('caseManagement1').value;
    }
    if (this.summaryForm.get('futureMedicalExpenses') != null) {
      this.reportSummary.futureMedicalExpenses = this.summaryForm.get('futureMedicalExpenses').value;
    }
    if (this.summaryForm.get('futureMedicalAndSurgicalIntervention') != null) {
      this.reportSummary.futureMedicalAndSurgicalIntervention = this.summaryForm.get('futureMedicalAndSurgicalIntervention').value;
    }
    if (this.summaryForm.get('lossOfEmenities') != null) {
      this.reportSummary.lossOfEmenities = this.summaryForm.get('lossOfEmenities').value;
    }
    if (this.summaryForm.get('occupationalTherapy') != null) {
      this.reportSummary.occupationalTherapy = this.summaryForm.get('occupationalTherapy').value;
    }
    if (this.summaryForm.get('physiotherapy') != null) {
      this.reportSummary.physiotherapy = this.summaryForm.get('physiotherapy').value;
    }
    if (this.summaryForm.get('psychology') != null) {
      this.reportSummary.psychology = this.summaryForm.get('psychology').value;
    }
    if (this.summaryForm.get('transportationCosts') != null) {
      this.reportSummary.transportationCosts = this.summaryForm.get('transportationCosts').value;
    }
    if (this.summaryForm.get('recommendations') != null) {
      this.reportSummary.recommendations = this.summaryForm.get('recommendations').value;
    }
    if (this.summaryForm.get('residualWorkCapacity') != null) {
      this.reportSummary.residualWorkCapacity = this.summaryForm.get('residualWorkCapacity').value;
    }
    if (this.summaryForm.get('specialEquipment') != null) {
      this.reportSummary.specialEquipment = this.summaryForm.get('specialEquipment').value;
    }
    this._reportSummaryService.create(this.reportSummary).
      pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe(() => {
        this.notify.success('Saved successfully!');
      });
  }

  getReportSummary() {
    this.isLoading = true;
    this._reportSummaryService.getByClientId(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe(result => {
        if (result != null) {
          this.reportSummary = result;
          this.summaryForm.patchValue(result);
        }
      });
  }


}
