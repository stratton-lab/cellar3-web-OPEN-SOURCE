import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EnrichmentBarPlotComponent} from './enrichment-bar-plot.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {MockComponent} from "ng-mocks";
import {DownloadComponent} from "../../../download/download.component";

describe('EnrichmentBarPlotComponent', () => {
  let component: EnrichmentBarPlotComponent;
  let fixture: ComponentFixture<EnrichmentBarPlotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule],
      declarations: [EnrichmentBarPlotComponent, MockComponent(DownloadComponent)]
    });
    fixture = TestBed.createComponent(EnrichmentBarPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
