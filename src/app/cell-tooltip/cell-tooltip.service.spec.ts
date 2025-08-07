import {TestBed} from '@angular/core/testing';

import {CellTooltipService} from './cell-tooltip.service';

describe('TooltipService', () => {
  let service: CellTooltipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CellTooltipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
