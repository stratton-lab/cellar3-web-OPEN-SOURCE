import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EnrichmentNetworkComponent} from './enrichment-network.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('EnrichmentNetworkComponent', () => {
  let component: EnrichmentNetworkComponent;
  let fixture: ComponentFixture<EnrichmentNetworkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule],
      declarations: [EnrichmentNetworkComponent]
    });
    fixture = TestBed.createComponent(EnrichmentNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
