import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DotplotComponent} from './dotplot.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('DotplotComponent', () => {
  let component: DotplotComponent;
  let fixture: ComponentFixture<DotplotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule],
      declarations: [DotplotComponent]
    });
    fixture = TestBed.createComponent(DotplotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
