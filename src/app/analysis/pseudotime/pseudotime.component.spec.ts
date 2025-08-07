import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PseudotimeComponent} from './pseudotime.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('PseudotimeComponent', () => {
  let component: PseudotimeComponent;
  let fixture: ComponentFixture<PseudotimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, LoggerTestingModule, RouterTestingModule],
      declarations: [PseudotimeComponent]
    });
    fixture = TestBed.createComponent(PseudotimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
