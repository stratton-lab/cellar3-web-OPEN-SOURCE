import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UmapComponent} from './umap.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('UmapComponent', () => {
  let component: UmapComponent;
  let fixture: ComponentFixture<UmapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule],
      declarations: [UmapComponent]
    });
    fixture = TestBed.createComponent(UmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
