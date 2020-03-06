/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OnetWebService } from './onet-web.service';

describe('Service: OnetWeb', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OnetWebService]
    });
  });

  it('should ...', inject([OnetWebService], (service: OnetWebService) => {
    expect(service).toBeTruthy();
  }));
});
