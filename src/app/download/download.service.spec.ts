import {TestBed} from '@angular/core/testing';

import {DownloadService} from './download.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('DownloadService', () => {
  let service: DownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(DownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
