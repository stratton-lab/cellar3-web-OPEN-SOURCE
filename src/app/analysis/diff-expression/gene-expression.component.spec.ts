import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DiffExpressionComponent} from "./gene-expression.component";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('DiffExpressionComponent', () => {
  let component: DiffExpressionComponent;
  let fixture: ComponentFixture<DiffExpressionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule],
      declarations: [DiffExpressionComponent]
    });
    fixture = TestBed.createComponent(DiffExpressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
