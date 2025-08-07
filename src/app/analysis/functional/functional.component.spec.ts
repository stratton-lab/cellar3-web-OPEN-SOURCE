import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FunctionalComponent} from './functional.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('FunctionalComponent', () => {
  let component: FunctionalComponent;
  let fixture: ComponentFixture<FunctionalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule],
      declarations: [FunctionalComponent]
    });
    fixture = TestBed.createComponent(FunctionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
