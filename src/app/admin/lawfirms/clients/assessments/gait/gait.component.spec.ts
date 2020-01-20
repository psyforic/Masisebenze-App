/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GaitComponent } from './gait.component';

describe('GaitComponent', () => {
  let component: GaitComponent;
  let fixture: ComponentFixture<GaitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GaitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
