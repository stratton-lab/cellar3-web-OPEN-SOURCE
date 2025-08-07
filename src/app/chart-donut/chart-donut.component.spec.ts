import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChartDonutComponent} from './chart-donut.component';

describe('ChartDonutComponent', () => {
  let component: ChartDonutComponent;
  let fixture: ComponentFixture<ChartDonutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartDonutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartDonutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
