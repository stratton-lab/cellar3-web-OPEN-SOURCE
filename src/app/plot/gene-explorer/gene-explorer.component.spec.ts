import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GeneExplorerComponent} from './gene-explorer.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('GeneExplorerComponent', () => {
  let component: GeneExplorerComponent;
  let fixture: ComponentFixture<GeneExplorerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule],
      declarations: [GeneExplorerComponent]
    });
    fixture = TestBed.createComponent(GeneExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
