import { JobDescriptionServiceProxy } from '@shared/service-proxies/service-proxies';
import { element } from 'protractor';
import { MatOptionSelectionChange } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { finalize, startWith, map } from 'rxjs/operators';
import {
  WorkAssessmentServiceProxy, WorkContextDto, ClientDetailOutput,
  ClientServiceProxy,
  WorkContextSummaryDto,
  SummaryReponseDto,
  OccupationDto,
  WorkInformationServiceProxy,
  WorkInformationDto
} from './../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, Injector, ElementRef, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NewJobDescriptionComponent } from '@app/admin/job-descriptions/new-job-description/new-job-description.component';
import { Location } from '@angular/common';
export class MaxDataValue {
  elementId: string;
  elementName: string;
  title: string;
  dataValue: number;
  category: number;
}
@Component({
  selector: 'app-work-information',
  templateUrl: './work-information.component.html',
  styleUrls: ['./work-information.component.scss'],
  providers: [WorkAssessmentServiceProxy, WorkInformationServiceProxy, JobDescriptionServiceProxy]
})

export class WorkInformationComponent extends AppComponentBase implements OnInit {
  client: ClientDetailOutput = new ClientDetailOutput();
  @ViewChild('newJob', { static: false }) newJob: NewJobDescriptionComponent;
  @ViewChild(MatAutocompleteTrigger, { static: false }) autocomplete: MatAutocompleteTrigger;
  clientId = '';
  defaultAge = [];
  ageList: string[] = [];
  workContextList: WorkContextDto[] = [];
  workContextSummaryList: WorkContextSummaryDto[] = [];
  responses: SummaryReponseDto[] = [];
  occupations: OccupationDto[] = [];
  maxDataValues: MaxDataValue[] = [];
  jobSearch: FormControl = new FormControl();
  jobTitle: FormControl = new FormControl();
  workInformation: WorkInformationDto = new WorkInformationDto();
  jobDescription;
  myControl = new FormControl();
  filteredOptions: Observable<OccupationDto[]>;
  isLoading = false;
  workConextDto: WorkContextDto = new WorkContextDto();

  // Worn Information
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  selectedOccupation: string[] = [];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('occupationInput', { static: false }) occupationInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(injector: Injector,
    private _clientService: ClientServiceProxy,
    private _workInformationService: WorkInformationServiceProxy,
    private route: ActivatedRoute,
    private _workAssessmentService: WorkAssessmentServiceProxy,
    private _jobDescriptionService: JobDescriptionServiceProxy,
    private _location: Location) {
    super(injector);
    this.route.paramMap.subscribe((paramMap) => {
      this.clientId = paramMap.get('id');
    });
  }

  ngOnInit() {
    this.getClient();
    this.filteredOptions = this.jobTitle.valueChanges
      .pipe(
        startWith(null),
        map((value: string | null) => value ? this._filter(value) : this.occupations.slice())
      );
    this.isLoading = true;
    this._workInformationService.getByClientId(this.clientId)
      .pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe(result => {
        if (result != null) {
          if (result.jobTitle != null && result.jobTitle !== '') {
            this.selectedOccupation[0] = result.jobTitle;
            this.workInformation = result;
          }
        }
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
  getOccupations(keyword, start: number, end: number) {
    this.occupations = [];
    this.isLoading = true;
    this._workAssessmentService.getOccpations(keyword, start, end)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(result => {
        this.occupations = result
          this._jobDescriptionService.searchJob(keyword).
          pipe(finalize(() => {
          })).subscribe(jobsFound => {
            jobsFound.forEach((value) => {
              const occupation = new OccupationDto();
              occupation.title = value.title,
              occupation.code = value.code;
              occupation.isLocal = true;
              this.occupations.push(occupation);
            });
          });
      });
  }
  getWorkContext(event: MatOptionSelectionChange, onetSocCode) {
    if (event.source.value != null && onetSocCode != null) {
      this.getElementNames(event.source.value);
    }
  }
  displayFn(occupation?: OccupationDto): string | undefined {
    return occupation ? occupation.title : undefined;
  }
  getElementNames(keyword) {
    this.ageList = [];
    this.isLoading = true;
    this._workAssessmentService.getWorkContext(keyword)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(result => {
        if (result != null && result.length > 0) {
          this.getWorkContextSummary(result[0].onetSocCode);
          this.workContextList = result;
          result.filter(x => x.elementID === '4.C.2.d.1.a' || x.elementID === '4.C.2.d.1.b' ||
            x.elementID === '4.C.2.d.1.c' || x.elementID === '4.C.2.d.1.d' || x.elementID === '4.C.2.d.1.e'
            || x.elementID === '4.C.2.d.1.f' || x.elementID === '4.C.2.d.1.g' || x.elementID === '4.C.2.d.1.h' ||
            x.elementID === '4.C.2.d.1.i')
            .forEach((workContext) => {
              const dataValues: number[] = [];
              if (this.ageList.indexOf(workContext.elementName) === -1) {
                result.filter(x => x.elementID === workContext.elementID)
                  .forEach((i) => {
                    dataValues.push(i.dataValue);
                  });
                if (workContext.dataValue === Math.max.apply(null, dataValues)) {
                  const maxDataValue = new MaxDataValue();
                  maxDataValue.dataValue = Math.max.apply(null, dataValues);
                  maxDataValue.title = workContext.title;
                  maxDataValue.elementId = workContext.elementID;
                  maxDataValue.elementName = workContext.elementName;
                  maxDataValue.category = workContext.category;
                  // console.log(dataValues);
                  this.maxDataValues.push(maxDataValue);
                  this.ageList.push(workContext.elementName);
                }
              }
            });

        }
      });
  }
  save() {
    this.isLoading = true;
    this.workInformation.clientId = this.clientId;
    this.workInformation.jobTitle = this.jobTitle.value.title;
    this._workInformationService.create(this.workInformation)
      .pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe(() => {
        this.notify.success('Saved successfully');
      });
  }
  search() {
    this.getOccupations(this.jobSearch.value, 1, 1000);
    // this.getElementNames(this.jobTitle.value);
  }
  getWorkContextSummary(onetSocCode) {
    this.isLoading = true;
    this._workAssessmentService.getWorkContextSummary(onetSocCode)
      .pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe(result => {
        this.workContextSummaryList = result;
        // console.log(result);
      });
  }
  getCategories(elementName) {
    return this.workContextList.filter(w => w.elementName === elementName);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.selectedOccupation[0] = value.trim();
      if (this.occupations.filter(x => x.title.includes(value)).length === 0) {
        this.autocomplete.closePanel();
        this.newJobTitle();
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.jobTitle.setValue({title:  this.selectedOccupation[0]});
  }

  remove(occupation: string): void {
    const index = this.selectedOccupation.indexOf(occupation);

    if (index >= 0) {
      this.selectedOccupation.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedOccupation[0] = event.option.viewValue;
    this.occupationInput.nativeElement.value = '';
    this.jobTitle.setValue({title:  this.selectedOccupation[0]});
  }
  newJobTitle() {
    this.newJob.open(this.selectedOccupation[0]);
  }
  isInList(jobTitle) {
    return this.occupations.filter(x => x.title === jobTitle).length > 0;
  }
  // onAgesAdd(tag: any): Observable<TagModel> {
  //   this.defaultAge.push(tag.value);
  //   this.workContextList.filter(x => x.elementName === tag.value);
  //   return of(tag);
  // }
  // onAgesRemove(tag: any): Observable<TagModel> {
  //   this.defaultAge.splice(this.defaultAge.indexOf(tag.value));
  //   return of(tag);
  // }
  private _filter(value: string): OccupationDto[] {
    const filterValue = (value != null && value !== '') ? value.toString().toLowerCase() : '';
    return this.occupations.filter(option => option.title.toLowerCase().includes(filterValue));
  }
}
