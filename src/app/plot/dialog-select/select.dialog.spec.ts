import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SelectDialogComponent} from './select.dialog';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {ToastrModule} from "ngx-toastr";

describe('SamplesSelectedDialogComponent', () => {
  let component: SelectDialogComponent;
  let fixture: ComponentFixture<SelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule, ToastrModule.forRoot({
        positionClass :'toast-bottom-right'
      })],
      declarations: [ SelectDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
