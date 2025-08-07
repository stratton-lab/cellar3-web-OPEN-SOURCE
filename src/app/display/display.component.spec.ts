import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DisplayComponent} from './display.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {LoggerTestingModule} from "ngx-logger/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {MockComponent} from "ng-mocks";
import {PlotComponent} from "../plot/plot.component";
import {AnnotateDialogComponent} from "../plot/dialog-annotate/annotate.dialog";
import {SelectDialogComponent} from "../plot/dialog-select/select.dialog";
import {DialogMultiselectComponent} from "../plot/dialog-multiselect/dialog-multiselect.component";
import {DiffExpressionComponent} from "../analysis/diff-expression/gene-expression.component";
import {ViolinComponent} from "../violin/violin.component";
import {UmapComponent} from "../umap/umap.component";
import {DotplotComponent} from "../dotplot/dotplot.component";
import {FunctionalComponent} from "../analysis/functional/functional.component";
import {PathwaysComponent} from "../analysis/pathways/pathways.component";
import {PseudotimeComponent} from "../analysis/pseudotime/pseudotime.component";
import {InteractionComponent} from "../analysis/interaction/interaction.component";
import {GeneExplorerComponent} from "../plot/gene-explorer/gene-explorer.component";

describe('DisplayComponent', () => {
  let component: DisplayComponent;
  let fixture: ComponentFixture<DisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoggerTestingModule, RouterTestingModule],
      declarations: [
        DisplayComponent,
        MockComponent(PlotComponent),
        MockComponent(AnnotateDialogComponent),
        MockComponent(SelectDialogComponent),
        MockComponent(DialogMultiselectComponent),
        MockComponent(DiffExpressionComponent),
        MockComponent(ViolinComponent),
        MockComponent(UmapComponent),
        MockComponent(DotplotComponent),
        MockComponent(FunctionalComponent),
        MockComponent(PathwaysComponent),
        MockComponent(PseudotimeComponent),
        MockComponent(InteractionComponent),
        MockComponent(GeneExplorerComponent)
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
