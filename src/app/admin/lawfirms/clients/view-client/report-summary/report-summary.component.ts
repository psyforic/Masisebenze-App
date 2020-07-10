import { NewEquipmentComponent } from './new-equipment/new-equipment.component';
import { EqualValidator } from './../../../../../../shared/directives/equal-validator.directive';
import {
  ReportSummaryServiceProxy, ReportSummaryDto, ClientServiceProxy,
  ClientDetailOutput
} from '../../../../../../shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { Component, OnInit, Injector, ViewChild, AfterViewInit, Input } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatSort, MatDialog } from '@angular/material';
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
export class ReportSummaryComponent extends AppComponentBase implements OnInit, AfterViewInit {

  @ViewChild('equipment', { static: true }) equipment;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() fullName: string;
  @Input() clientId: string;
  summaryForm: FormGroup;
  client: ClientDetailOutput = new ClientDetailOutput();
  isLoading = false;
  reportSummary: ReportSummaryDto = new ReportSummaryDto();
  displayedColumns: string[] = ['equipment', 'estimatedLifespan', 'approximateCost'];
  dataSource = new MatTableDataSource<(Equipment | Group)>();
  equipments: (Equipment | Group)[] = [];
  groups: Group[] = [];

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
    this.dataSource.data = this.equipments;
    this.dataSource.sort = this.sort;
  }
  ngAfterViewInit() {
    console.log(this.equipment);
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

  private get tableModule() {
    return this.equipment.getModule('table');
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
  isGroup(index, item): boolean {
    return item.group;
  }
  addEquipment() {
    // this.cognitiveComment.show();
    this.dialog.open(NewEquipmentComponent, {
      hasBackdrop: false,
      data: { fullName: this.fullName, clientId: this.clientId },
      width: '650px'
    }).afterClosed().subscribe(result => {
      if (result) {
        if (this.groups.filter(x => x.group === result.section).length === 0) {
          this.groups.push({ group: result.section });
          this.equipments.push({ group: result.section });
        } else {

        }
        if (this.groups.filter(x => x.group === result.section).length > 0) {

        }
        this.equipments.push(result);
        this.dataSource.data = this.equipments;
        this.dataSource.sort = this.sort;
      }
    });
  }
}
