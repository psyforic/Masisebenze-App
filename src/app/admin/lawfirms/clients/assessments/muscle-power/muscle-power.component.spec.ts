/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MusclePowerComponent } from './muscle-power.component';

describe('MusclePowerComponent', () => {
  let component: MusclePowerComponent;
  let fixture: ComponentFixture<MusclePowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusclePowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusclePowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
