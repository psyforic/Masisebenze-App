import { finalize } from 'rxjs/operators';
import {
  WorkAssessmentServiceProxy, WorkContextDto, ClientDetailOutput,
  ClientServiceProxy
} from './../../../../../shared/service-proxies/service-proxies';
import { Component, OnInit, Injector, ElementRef } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { ActivatedRoute } from '@angular/router';
import { TagModel } from 'ngx-chips/core/accessor';
import { Observable, of } from 'rxjs';
import { FormControl } from '@angular/forms';
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
  jobTitle: FormControl = new FormControl();
  company: FormControl = new FormControl();
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
  getElementNames(keyword) {
    this.ageList = [];
    this.isLoading = true;
    this._workAssessmentService.getWorkContext(keyword)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe(result => {
        if (result != null && result.length > 0) {
          this.workContextList = result;
          result.forEach((workContext) => {
            if (this.ageList.indexOf(workContext.elementName) === -1) {
              this.ageList.push(workContext.elementName);
            }
          });
        }
      });
  }
  search() {
    this.getElementNames(this.jobTitle.value);
  }
  getCategories(elementName){
    return this.workContextList.filter(w => w.elementName === elementName);
  }
  onAgesAdd(tag: any): Observable<TagModel> {
    this.defaultAge.push(tag.value);
    return of(tag);
  }
  onAgesRemove(tag: any): Observable<TagModel> {
    this.defaultAge.splice(this.defaultAge.indexOf(tag.value));
    return of(tag);
  }
}
