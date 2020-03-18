import { element } from 'protractor';
import { MatOptionSelectionChange } from '@angular/material';

import { finalize, startWith, map } from 'rxjs/operators';
import {
  WorkAssessmentServiceProxy, WorkContextDto, ClientDetailOutput,
  ClientServiceProxy,
  WorkContextSummaryDto,
  SummaryReponseDto,
  OccupationDto
} from './../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, Injector, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { TagModel } from 'ngx-chips/core/accessor';
import { Observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';
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
  providers: [WorkAssessmentServiceProxy]
})

export class WorkInformationComponent extends AppComponentBase implements OnInit {
  client: ClientDetailOutput = new ClientDetailOutput();
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
  myControl = new FormControl();
  filteredOptions: Observable<OccupationDto[]>;
  isLoading = false;
  workConextDto: WorkContextDto = new WorkContextDto();
  constructor(injector: Injector,
    private _clientService: ClientServiceProxy,
    private route: ActivatedRoute,
    private _workAssessmentService: WorkAssessmentServiceProxy) {
    super(injector);
    this.route.paramMap.subscribe((paramMap) => {
      this.clientId = paramMap.get('id');
    });
  }

  ngOnInit() {
    this.getClient();
    this.filteredOptions = this.jobTitle.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
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
        this.occupations = result;
        // console.log(this.occupations);
      });
  }
  getWorkContext(event: MatOptionSelectionChange, onetSocCode) {
    if (event.source.value != null && onetSocCode != null) {
      this.getElementNames(event.source.value);
    }
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
  onAgesAdd(tag: any): Observable<TagModel> {
    this.defaultAge.push(tag.value);
    this.workContextList.filter(x => x.elementName === tag.value);
    return of(tag);
  }
  onAgesRemove(tag: any): Observable<TagModel> {
    this.defaultAge.splice(this.defaultAge.indexOf(tag.value));
    return of(tag);
  }
  private _filter(value: string): OccupationDto[] {
    const filterValue = value.toLowerCase();

    return this.occupations.filter(option => option.title.toLowerCase().includes(filterValue));
  }
}
