import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GeneSearchComponent} from './gene-search.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule} from "@angular/forms";

describe('GeneSearchComponent', () => {
  let component: GeneSearchComponent;
  let fixture: ComponentFixture<GeneSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule, FormsModule],
      declarations: [GeneSearchComponent]
    });
    fixture = TestBed.createComponent(GeneSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
