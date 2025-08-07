import {TestBed} from '@angular/core/testing';

import {DatasetSearchService} from './dataset-search.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('SearchService', () => {
  let service: DatasetSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(DatasetSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
