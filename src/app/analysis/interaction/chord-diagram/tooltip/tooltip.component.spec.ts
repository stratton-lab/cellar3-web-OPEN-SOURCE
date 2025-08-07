import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InteractionsTooltipComponent} from './tooltip.component';

describe('TooltipComponent', () => {
  let component: InteractionsTooltipComponent;
  let fixture: ComponentFixture<InteractionsTooltipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InteractionsTooltipComponent]
    });
    fixture = TestBed.createComponent(InteractionsTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
