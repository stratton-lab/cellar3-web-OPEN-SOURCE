import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PiechartComponent} from './piechart.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {MockComponent} from "ng-mocks";
import {PlotlyComponent} from "angular-plotly.js";
import {CellsTooltipComponent} from "../../../cells-tooltip/cells-tooltip.component";

describe('PiechartComponent', () => {
  let component: PiechartComponent;
  let fixture: ComponentFixture<PiechartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule],
      declarations: [PiechartComponent, MockComponent(PlotlyComponent), MockComponent(CellsTooltipComponent)]
    });
    fixture = TestBed.createComponent(PiechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
