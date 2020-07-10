
import { EqualValidator } from './../../../../../../shared/directives/equal-validator.directive';
import {
  ReportSummaryServiceProxy, ReportSummaryDto, ClientServiceProxy,
  ClientDetailOutput
} from '../../../../../../shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, Injector, Input } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { summary } from './summary';
export interface Equipment {
  section: string;
  equipment: string;
  estimatedLifespan: string;
  approximateCost: number;
}
export interface Group {
  group: string;
}
@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['./report-summary.component.scss'],
  providers: [ReportSummaryServiceProxy, ClientServiceProxy]
})
export class ReportSummaryComponent extends AppComponentBase implements OnInit {


  @Input() fullName: string;
  @Input() clientId: string;
  summaryForm: FormGroup;
  client: ClientDetailOutput = new ClientDetailOutput();
  isLoading = false;
  reportSummary: ReportSummaryDto = new ReportSummaryDto();
  summary = summary;
  config = {
    placeholder: '',
    spellCheck: true,
    height: '200px',
    direction: 'rtl',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  };
  constructor(
    injector: Injector,
    private dialog: MatDialog,
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
      transportationCosts: [''],
      homeAdaptions: ['']
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
    if (this.summaryForm.get('supplementaryHealthServices') != null) {
      this.reportSummary.supplementaryHealthServices = this.summaryForm.get('supplementaryHealthServices').value;
    }
    if (this.summaryForm.get('homeAdaptions') != null) {
      this.reportSummary.homeAdaptions = this.summaryForm.get('homeAdaptions').value;
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
          if (this.reportSummary != null) {
            this.reportSummary.discussion = this.reportSummary.discussion ?
              this.reportSummary.discussion : this.summary.discussion;

            this.reportSummary.lossOfEmenities = this.reportSummary.lossOfEmenities ?
              this.reportSummary.lossOfEmenities : this.summary.lossOfAmenities;

            this.reportSummary.occupationalTherapy = this.reportSummary.occupationalTherapy ?
              this.reportSummary.occupationalTherapy : this.summary.occupationalTherapy;

            this.reportSummary.caseManagement1 = this.reportSummary.caseManagement1 ?
              this.reportSummary.caseManagement1 : this.summary.caseManagement1;

            this.reportSummary.futureMedicalExpenses = this.reportSummary.futureMedicalExpenses ?
              this.reportSummary.futureMedicalExpenses : this.summary.futureMedicalExpenses;

            this.reportSummary.physiotherapy = this.reportSummary.physiotherapy ?
              this.reportSummary.physiotherapy : this.summary.physiotherapy;

            this.reportSummary.psychology = this.reportSummary.psychology ?
              this.reportSummary.psychology : this.summary.psychology;

            this.reportSummary.futureMedicalAndSurgicalIntervention = this.reportSummary.futureMedicalAndSurgicalIntervention ?
              this.reportSummary.futureMedicalAndSurgicalIntervention : this.summary.futureMedicalAndSurgicalIntervention;

            this.reportSummary.transportationCosts = this.reportSummary.transportationCosts ?
              this.reportSummary.transportationCosts : this.summary.transportationCosts;

            this.reportSummary.recommendations = this.reportSummary.recommendations ?
              this.reportSummary.recommendations : this.summary.recommendations;

            this.reportSummary.residualWorkCapacity = this.reportSummary.residualWorkCapacity ?
              this.reportSummary.residualWorkCapacity : this.summary.residualWorkCapacity;

            this.reportSummary.specialEquipment = this.reportSummary.specialEquipment ?
              this.reportSummary.specialEquipment : this.summary.specialEquipment;

            this.reportSummary.supplementaryHealthServices = this.reportSummary.supplementaryHealthServices ?
              this.reportSummary.supplementaryHealthServices : this.summary.supplementaryHealthServices;

            this.reportSummary.homeAdaptions = this.reportSummary.homeAdaptions ?
              this.reportSummary.homeAdaptions : this.summary.homeAdaptions;

            this.summaryForm.patchValue(result);

          }
        }
      });
  }

}
