import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CellsTooltipComponent} from './cells-tooltip.component';

describe('CellsTooltipComponent', () => {
  let component: CellsTooltipComponent;
  let fixture: ComponentFixture<CellsTooltipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CellsTooltipComponent]
    });
    fixture = TestBed.createComponent(CellsTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
