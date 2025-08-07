import {Injectable} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {HttpClient, HttpEvent} from "@angular/common/http";
import {Observable, retry} from "rxjs";
import {environment} from "../environments/environment";
import {PlotConfig, UmapConfig} from "./plot/2Dplot.interface";
import _ from "lodash";
import {DGE} from "./analysis/diff-expression/volcano/volcano";
import {Violin} from "./violin/violin.interface";
import {DotPlotOutput} from "./dotplot/dotplot";
import {MultiGenesUmapData} from "./umap/umap.interface";
import {BarPlot,} from "./analysis/functional/bar/bar.interface";
import {PathwaysPlot} from "./analysis/pathways/pathway.interface";
import {NetworkPlot} from "./analysis/functional/network/network.interface";
import {Dataset} from "./dataset";
import {SubmitMetaResult} from "./submit/submit-meta/fields.interface";
import {SubmissionInfo} from "./submit/submit-dataset/submission-info.interface";
import {CellCellInteractionsData} from "./analysis/interaction/interaction.interface";
import {DatasetsData} from "./datasets/datasets.interface";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private logger: NGXLogger, private http: HttpClient) {
  }

  _getDefinedParams = (params: any) => _.pickBy(params, value => value !== undefined)

  /**
   * Returns a list of public datasets. ONly meta data is returned, no actual h5ad files.
   */
  getPublicDatasets(): Observable<DatasetsData> {
    return this.http.get<DatasetsData>(`${environment.backend}/marketplace/`).pipe(retry(1)
    )
  }

  /**
   * Returns plotly data to display cells on a 2D space.
   * @todo Use cache
   * @param datasetId Id of the dataset to load and display.
   * @param groupColumn Ex: cell_type, Column in obs DataFrame
   * @param embeddingName Ex: X_umap, Matrix in obsm DataFrame
   */
  getCells2DPlot(datasetId: string, groupColumn: string, embeddingName: string): Observable<PlotConfig> {
    return this.http.get<PlotConfig>(`${environment.backend}/dataset/${datasetId}/`, {
      params: _.pickBy({
        group_by: groupColumn,
        embedding: embeddingName
      }, value => value !== undefined)
    }).pipe(retry(1))
  }

  getUMAP(datasetId: string, embeddingName: string, groupColumn: string): Observable<UmapConfig> {
    return this.http.get<UmapConfig>(`${environment.backend}/dataset/${datasetId}/umap`, {
      params: _.pickBy({
        embedding: embeddingName,
        group_by: groupColumn
      }, value => value !== undefined)
    }).pipe(retry(1))
  }

  /**
   * Returns cell cell interaction data.
   * @param datasetId
   * @param source Source cell type
   * @param targets List of cell types to use as targets
   * @param type
   */
  getInteraction(datasetId: string, source: string, targets: string[], type: string | undefined): Observable<CellCellInteractionsData> {
    return this.http.post<CellCellInteractionsData>(`${environment.backend}/analysis/interaction/${datasetId}/`,
      this._getDefinedParams({
        source: source,
        targets: targets,
        type: type
      }))
  }

  getDiffExpressionVolcano(datasetId: string, target: number[], background: number[]): Observable<DGE> {
    return this.http.post<DGE>(`${environment.backend}/analysis/expression/diff/${datasetId}/`, {
      target: target,
      background: background
    })
  }

  getEnrichmentBar(datasetId: string, target: number[], background: number[], geneSet: String): Observable<BarPlot> {
    return this.http.post<BarPlot>(`${environment.backend}/analysis/expression/functional/bar/${datasetId}/`, {
      target: target,
      background: background,
      gene_set: geneSet
    })
  }

  getEnrichmentNetwork(datasetId: string, target: number[], background: number[], geneSet: String): Observable<NetworkPlot> {
    return this.http.post<NetworkPlot>(`${environment.backend}/analysis/expression/functional/network/${datasetId}/`, {
      target: target,
      background: background,
      gene_set: geneSet
    })
  }

  /**
   *
   * @param datasetId
   * @param pathway
   * @param species
   * @param upregulated List of gene symbols of upregulated genes
   * @param downregulated List of gene symbols of downregulated genes
   */
  getPathways(datasetId: string, pathway: String, species: String, upregulated: String[], downregulated: String[]): Observable<PathwaysPlot> {
    return this.http.post<PathwaysPlot>(`${environment.backend}/analysis/expression/pathways/${datasetId}/`, {
      pathway: pathway,
      species: species,
      upregulated: upregulated,
      downregulated: downregulated
    })
  }

  getExportableDiffExpression(datasetId: string, target: number[], background: number[], format = 'csv'): Observable<Blob> {
    return this.http.post<Blob>(`${environment.backend}/analysis/expression/diff/${datasetId}/export/${format}`, {
      target: target,
      background: background
    }, {
      responseType: 'blob' as 'json'
    })
  }

  getExportableFunctionalEnrichment(datasetId: string, target: number[], background: number[], gene_set: string, format = 'csv'): Observable<Blob> {
    return this.http.post<Blob>(`${environment.backend}/analysis/expression/functional/${datasetId}/export/${format}`, {
      target: target,
      background: background,
      gene_set: gene_set
    }, {
      responseType: 'blob' as 'json'
    })
  }

  getViolinPlot(datasetId: string, genes: string[], target: number[], background: number[]): Observable<Violin> {
    return this.http.post<Violin>(`${environment.backend}/analysis/expression/violin/${datasetId}/`, {
      genes: genes,
      target: target,
      background: background
    })
  }

  getUmapPlot(datasetId: string, genes: string[], embedding: string): Observable<MultiGenesUmapData> {
    return this.http.post<MultiGenesUmapData>(`${environment.backend}/analysis/expression/umap/${datasetId}/`, {
      genes: genes,
      embedding: embedding
    })
  }

  getDotPlot(datasetId: string, genes: string[], target: number[], background: number[]): Observable<DotPlotOutput> {
    return this.http.post<DotPlotOutput>(`${environment.backend}/analysis/expression/dot/${datasetId}/`, {
      genes: genes,
      target: target,
      background: background
    })
  }

  /**
   * Allows users to file a pre-submission request.
   */
  submitDatasetMeta(meta: Dataset, notes: string): Observable<SubmitMetaResult> {
    return this.http.post<SubmitMetaResult>(`${environment.backend}/submit/meta/`, {
      meta: meta,
      notes: notes
    })
  }

  /**
   * Returns information about an existing pre-submission.
   * @param submission_id
   */
  getSubmissionInfo(submission_id: string): Observable<SubmissionInfo> {
    return this.http.get<SubmissionInfo>(`${environment.backend}/submit/file/${submission_id}/`)
  }

  /**
   * Allows users to submit their dataset to the website.
   * @param submission_id
   * @param form. Contains the uploaded dataset file and metadata dict describing the dataset.
   */
  submitDatasetFile(submission_id: string, form: FormData): Observable<HttpEvent<SubmitMetaResult>> {
    return this.http.post<SubmitMetaResult>(`${environment.backend}/submit/file/${submission_id}/`, form, {
      reportProgress: true,
      observe: 'events',
    })
  }

  getDatasetsProdStatus(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(`${environment.backend}/dataset/status/public/prod`)
  }

}
