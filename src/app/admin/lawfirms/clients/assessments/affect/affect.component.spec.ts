/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AffectComponent } from './affect.component';

describe('AffectComponent', () => {
  let component: AffectComponent;
  let fixture: ComponentFixture<AffectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
