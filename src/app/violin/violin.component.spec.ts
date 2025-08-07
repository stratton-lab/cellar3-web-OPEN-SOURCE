import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ViolinComponent} from './violin.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('ViolinComponent', () => {
  let component: ViolinComponent;
  let fixture: ComponentFixture<ViolinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule],
      declarations: [ViolinComponent]
    });
    fixture = TestBed.createComponent(ViolinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
