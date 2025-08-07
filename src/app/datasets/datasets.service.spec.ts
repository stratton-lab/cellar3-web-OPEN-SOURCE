import {TestBed} from '@angular/core/testing';

import {DatasetsService} from './datasets.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('DatasetsService', () => {
  let service: DatasetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(DatasetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
