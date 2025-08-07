import {TestBed} from '@angular/core/testing';

import {BackendService} from './backend.service';
import {RouterTestingModule} from "@angular/router/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('BackendService', () => {
  let service: BackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(BackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
