/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GripStrengthComponent } from './grip-strength.component';

describe('GripStrengthComponent', () => {
  let component: GripStrengthComponent;
  let fixture: ComponentFixture<GripStrengthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GripStrengthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GripStrengthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
