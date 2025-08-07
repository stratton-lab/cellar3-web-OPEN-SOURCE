import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InteractionDetailsComponent} from './interaction-details.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('InteractionDetailsComponent', () => {
  let component: InteractionDetailsComponent;
  let fixture: ComponentFixture<InteractionDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule],
      declarations: [InteractionDetailsComponent]
    });
    fixture = TestBed.createComponent(InteractionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
