import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CellTooltipComponent} from './cell-tooltip.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('TooltipComponent', () => {
  let component: CellTooltipComponent;
  let fixture: ComponentFixture<CellTooltipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule],
      declarations: [CellTooltipComponent]
    });
    fixture = TestBed.createComponent(CellTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
