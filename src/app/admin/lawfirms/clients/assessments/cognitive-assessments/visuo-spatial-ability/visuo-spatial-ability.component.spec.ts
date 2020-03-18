/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VisuoSpatialAbilityComponent } from './visuo-spatial-ability.component';

describe('VisuoSpatialAbilityComponent', () => {
  let component: VisuoSpatialAbilityComponent;
  let fixture: ComponentFixture<VisuoSpatialAbilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisuoSpatialAbilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisuoSpatialAbilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
