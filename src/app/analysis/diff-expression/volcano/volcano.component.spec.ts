import {ComponentFixture, TestBed} from '@angular/core/testing';

import {VolcanoComponent} from './volcano.component';
import {MockComponent} from "ng-mocks";
import {PlotlyComponent} from "angular-plotly.js";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {GeneTooltipComponent} from "../../../gene-tooltip/gene-tooltip.component";

describe('VolcanoComponent', () => {
  let component: VolcanoComponent;
  let fixture: ComponentFixture<VolcanoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule],
      declarations: [VolcanoComponent,
        MockComponent(PlotlyComponent),
        MockComponent(GeneTooltipComponent)
      ]
    });
    fixture = TestBed.createComponent(VolcanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
