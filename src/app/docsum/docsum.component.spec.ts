import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DocsumComponent} from './docsum.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FacetComponent} from "./facet/facet.component";

describe('DocsumComponent', () => {
  let component: DocsumComponent;
  let fixture: ComponentFixture<DocsumComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule, FacetComponent],
      declarations: [DocsumComponent]
    });
    fixture = TestBed.createComponent(DocsumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
