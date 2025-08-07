import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChordDiagramComponent} from './chord-diagram.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {MockComponent} from "ng-mocks";
import {InteractionDetailsComponent} from "./interaction-details/interaction-details.component";
import {InteractionsTooltipComponent} from "./tooltip/tooltip.component";

describe('ChordDiagramComponent', () => {
  let component: ChordDiagramComponent;
  let fixture: ComponentFixture<ChordDiagramComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule],
      declarations: [
        ChordDiagramComponent,
        MockComponent(InteractionsTooltipComponent),
        MockComponent(InteractionDetailsComponent)
      ]
    });
    fixture = TestBed.createComponent(ChordDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
