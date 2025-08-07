import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GeneTooltipComponent} from './gene-tooltip.component';

describe('GeneTooltipComponent', () => {
  let component: GeneTooltipComponent;
  let fixture: ComponentFixture<GeneTooltipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneTooltipComponent]
    });
    fixture = TestBed.createComponent(GeneTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
