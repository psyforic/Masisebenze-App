/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MobilityComponent } from './mobility.component';

describe('MobilityComponent', () => {
  let component: MobilityComponent;
  let fixture: ComponentFixture<MobilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
