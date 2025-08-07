import {TestBed} from '@angular/core/testing';
import {CanActivateFn} from '@angular/router';

import {devOnlyGuard} from './dev-only.guard';

describe('devOnlyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => devOnlyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
