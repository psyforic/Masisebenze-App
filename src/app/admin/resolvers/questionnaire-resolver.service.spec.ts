/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QuestionnaireResolverService } from './questionnaire-resolver.service';

describe('Service: QuestionnaireResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuestionnaireResolverService]
    });
  });

  it('should ...', inject([QuestionnaireResolverService], (service: QuestionnaireResolverService) => {
    expect(service).toBeTruthy();
  }));
});
