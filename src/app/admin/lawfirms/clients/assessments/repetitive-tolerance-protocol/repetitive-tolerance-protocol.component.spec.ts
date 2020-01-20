/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RepetitiveToleranceProtocolComponent } from './repetitive-tolerance-protocol.component';

describe('RepetitiveToleranceProtocolComponent', () => {
  let component: RepetitiveToleranceProtocolComponent;
  let fixture: ComponentFixture<RepetitiveToleranceProtocolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepetitiveToleranceProtocolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepetitiveToleranceProtocolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
