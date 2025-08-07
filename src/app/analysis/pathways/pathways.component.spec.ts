import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PathwaysComponent} from './pathways.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('EnrichmentPathwaysComponent', () => {
  let component: PathwaysComponent;
  let fixture: ComponentFixture<PathwaysComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule],
      declarations: [PathwaysComponent]
    });
    fixture = TestBed.createComponent(PathwaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
