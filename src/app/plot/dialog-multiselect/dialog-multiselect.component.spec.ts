import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogMultiselectComponent} from './dialog-multiselect.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('DialogMultiselectComponent', () => {
  let component: DialogMultiselectComponent;
  let fixture: ComponentFixture<DialogMultiselectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule],
      declarations: [DialogMultiselectComponent]
    });
    fixture = TestBed.createComponent(DialogMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
