/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TopBarService } from './top-bar.service';

describe('Service: TopBar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TopBarService]
    });
  });

  it('should ...', inject([TopBarService], (service: TopBarService) => {
    expect(service).toBeTruthy();
  }));
});
