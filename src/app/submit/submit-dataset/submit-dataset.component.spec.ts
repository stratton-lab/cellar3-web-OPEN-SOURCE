import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SubmitDatasetComponent} from './submit-dataset.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('SubmitDatasetComponent', () => {
  let component: SubmitDatasetComponent;
  let fixture: ComponentFixture<SubmitDatasetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule],
      declarations: [SubmitDatasetComponent]
    });
    fixture = TestBed.createComponent(SubmitDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
