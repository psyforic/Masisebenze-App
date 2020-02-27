import { registerLocaleData } from '@angular/common';
import { FunctionalAssessmentServiceProxy, ListResultDtoOfQuestionListDto } from './../../../shared/service-proxies/service-proxies';
import { Injectable } from '@angular/core';
import { Resolver, resolve } from 'dns';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { state } from '@angular/animations';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireResolverService implements Resolve<any> {


  constructor(private _functionalAssessmentService: FunctionalAssessmentServiceProxy) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const clientId = route.params['id'];
    return this._functionalAssessmentService.getQuestionList(1);
  }
}
