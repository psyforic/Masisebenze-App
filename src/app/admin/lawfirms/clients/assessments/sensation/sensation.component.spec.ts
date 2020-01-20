/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SensationComponent } from './sensation.component';

describe('SensationComponent', () => {
  let component: SensationComponent;
  let fixture: ComponentFixture<SensationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
