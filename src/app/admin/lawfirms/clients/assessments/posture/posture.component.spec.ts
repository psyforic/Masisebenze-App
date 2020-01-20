/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PostureComponent } from './posture.component';

describe('PostureComponent', () => {
  let component: PostureComponent;
  let fixture: ComponentFixture<PostureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
