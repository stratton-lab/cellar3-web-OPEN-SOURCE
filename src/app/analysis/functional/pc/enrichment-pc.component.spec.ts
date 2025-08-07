import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EnrichmentPcComponent} from './enrichment-pc.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('EnrichmentPcComponent', () => {
  let component: EnrichmentPcComponent;
  let fixture: ComponentFixture<EnrichmentPcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule],
      declarations: [EnrichmentPcComponent]
    });
    fixture = TestBed.createComponent(EnrichmentPcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
