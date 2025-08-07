import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {DisplayComponent} from './display/display.component';
import {FileUploadComponent} from "./file-upload/file-upload.component";
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {FooterComponent} from "./footer/footer.component";
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {LoggerModule, NgxLoggerLevel} from "ngx-logger";
import {MarketplaceComponent} from './datasets/marketplace.component';
import {PagerComponent} from './pager/pager.component';
import {PlotlyModule} from "angular-plotly.js";
import * as PlotlyJS from 'plotly.js-dist-min';
import {AnnotateDialogComponent} from "./plot/dialog-annotate/annotate.dialog";
import {SelectDialogComponent} from "./plot/dialog-select/select.dialog";
import {PlotComponent} from './plot/plot.component';
import {DatasetItemComponent} from './datasets/dataset-item/dataset-item.component';
import {NgxSliderModule} from "ngx-slider-v2";
import {PiechartComponent} from './plot/dialog-select/piechart/piechart.component';
import {CellTooltipComponent} from './cell-tooltip/cell-tooltip.component';
import {InteractionComponent} from './analysis/interaction/interaction.component';
import {FunctionalComponent} from './analysis/functional/functional.component';
import {DialogMultiselectComponent} from './plot/dialog-multiselect/dialog-multiselect.component';
import {NgOptimizedImage} from "@angular/common";
import {BarchartComponent} from './plot/dialog-multiselect/barchart/barchart.component';
import {DiffExpressionComponent} from "./analysis/diff-expression/gene-expression.component";
import {VolcanoComponent} from './analysis/diff-expression/volcano/volcano.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ViolinComponent} from './violin/violin.component';
import {DotplotComponent} from './dotplot/dotplot.component';
import {UmapComponent} from './umap/umap.component';
import {PrivacyComponent} from './privacy/privacy.component';
import {DisclaimerComponent} from './disclaimer/disclaimer.component';
import {DownloadComponent} from './download/download.component';
import {ToastrModule} from "ngx-toastr";
import {GeneSearchComponent} from './gene-search/gene-search.component';
import {GeneTooltipComponent} from './gene-tooltip/gene-tooltip.component';
import {DatasetSearchComponent} from "./datasets/dataset-search/dataset-search.component";
import {TutorialComponent} from './tutorial/tutorial.component';
import {CellsTooltipComponent} from './cells-tooltip/cells-tooltip.component';
import {EnrichmentBarPlotComponent} from './analysis/functional/bar/enrichment-bar-plot.component';
import {EnrichmentNetworkComponent} from './analysis/functional/network/enrichment-network.component';
import {EnrichmentPcComponent} from './analysis/functional/pc/enrichment-pc.component';
import {PathwaysComponent} from './analysis/pathways/pathways.component';
import {PseudotimeComponent} from './analysis/pseudotime/pseudotime.component';
import {SubmitDatasetComponent} from './submit/submit-dataset/submit-dataset.component';
import {SubmitMetaComponent} from "./submit/submit-meta/submit-meta.component";
import {ChordDiagramComponent} from './analysis/interaction/chord-diagram/chord-diagram.component';
import {InteractionsTooltipComponent} from './analysis/interaction/chord-diagram/tooltip/tooltip.component';
import {
  InteractionDetailsComponent
} from './analysis/interaction/chord-diagram/interaction-details/interaction-details.component';
import {GeneExplorerComponent} from './plot/gene-explorer/gene-explorer.component';
import {DocsumComponent} from './docsum/docsum.component';
import {FacetComponent} from "./docsum/facet/facet.component";
import {NgChartsModule} from 'ng2-charts';
import {ChartDonutComponent} from "./chart-donut/chart-donut.component";

PlotlyModule.plotlyjs = PlotlyJS

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DisplayComponent,
    FileUploadComponent,
    ToolbarComponent,
    FooterComponent,
    MarketplaceComponent,
    PagerComponent,
    DisplayComponent,
    AnnotateDialogComponent,
    SelectDialogComponent,
    PlotComponent,
    DatasetItemComponent,
    DatasetSearchComponent,
    PiechartComponent,
    CellTooltipComponent,
    DiffExpressionComponent,
    InteractionComponent,
    FunctionalComponent,
    DialogMultiselectComponent,
    BarchartComponent,
    VolcanoComponent,
    ViolinComponent,
    DotplotComponent,
    UmapComponent,
    PrivacyComponent,
    DisclaimerComponent,
    DownloadComponent,
    GeneSearchComponent,
    GeneTooltipComponent,
    TutorialComponent,
    CellsTooltipComponent,
    EnrichmentBarPlotComponent,
    EnrichmentNetworkComponent,
    EnrichmentPcComponent,
    PathwaysComponent,
    PseudotimeComponent,
    SubmitMetaComponent,
    SubmitDatasetComponent,
    ChordDiagramComponent,
    InteractionsTooltipComponent,
    InteractionDetailsComponent,
    GeneExplorerComponent,
    DocsumComponent
  ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        RouterModule,
        PlotlyModule,
        NgxSliderModule,
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-right'
        }),
        LoggerModule.forRoot({
            // serverLoggingUrl: '/api/logs',
            level: NgxLoggerLevel.DEBUG,
            // serverLogLevel: NgxLoggerLevel.ERROR
        }),
        NgOptimizedImage,
        FacetComponent,
        NgChartsModule,
        ChartDonutComponent
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
