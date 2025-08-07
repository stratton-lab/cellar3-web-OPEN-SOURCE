import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DatasetItemComponent} from './dataset-item.component';
import {LoggerTestingModule} from "ngx-logger/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('DatasetItemComponent', () => {
  let component: DatasetItemComponent;
  let fixture: ComponentFixture<DatasetItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggerTestingModule, HttpClientTestingModule],
      declarations: [DatasetItemComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
