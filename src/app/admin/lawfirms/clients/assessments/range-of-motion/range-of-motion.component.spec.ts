/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RangeOfMotionComponent } from './range-of-motion.component';

describe('RangeOfMotionComponent', () => {
  let component: RangeOfMotionComponent;
  let fixture: ComponentFixture<RangeOfMotionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RangeOfMotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeOfMotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
