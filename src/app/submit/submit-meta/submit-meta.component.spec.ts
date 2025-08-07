import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SubmitMetaComponent} from './submit-meta.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule} from "@angular/forms";

describe('SubmitComponent', () => {
  let component: SubmitMetaComponent;
  let fixture: ComponentFixture<SubmitMetaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule, FormsModule],
      declarations: [SubmitMetaComponent]
    });
    fixture = TestBed.createComponent(SubmitMetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
