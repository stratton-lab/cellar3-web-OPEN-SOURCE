import {Injectable} from '@angular/core';
import {Message} from "../message";
import {NGXLogger} from "ngx-logger";
import {BehaviorSubject, Observable} from "rxjs";
import {DatasetsData} from "./datasets.interface";
import {Dataset, DatasetMap, DatasetsMap} from "../dataset";
import _ from "lodash";
import {BackendService} from "../backend.service";
import {Category} from "./category.interface";

@Injectable({
  providedIn: 'root'
})
export class DatasetsService {

  msg: Message | null = null
  busy = false

  datasets: DatasetMap = {}
  selectedCategory: Category
  categories2datasets: DatasetsMap = {} // Maps a category id to a list of datasets
  backStack: Category[] = []

  private _onLoaded = new BehaviorSubject<Dataset[]>([])
  onLoaded: Observable<Dataset[]> = this._onLoaded.asObservable()

  constructor(private logger: NGXLogger, private backend: BackendService) {
    this.load()
  }

  /**
   * Loads categories and datasets from the server.
   */
  load() {
    this.busy = true
    this.backend.getPublicDatasets().subscribe({
      next: (data: DatasetsData) => {
        this.busy = false
        this.datasets = this.getDatasetMap(data.datasets)
        this.categories2datasets = this.getCategoryToDatasetsMapping(data.datasets)
        this.selectedCategory = data.categories
        this.assignDatasetsToCategories(this.selectedCategory)
        this.backStack = [this.selectedCategory]
        this.logger.info('[DatasetsService] (load)', 'Loaded datasets and categories.')
        this._onLoaded.next(data.datasets)
      },
      error: err => {
        this.busy = false
        this.msg = err
      }
    })
  }

  isEmpty(selectedCategory: Category) {
    return _.isEmpty(this.selectedCategory?.categories) && !this.getSelectedCategoryDatasets()
  }

  selectCategory(category: Category) {
    this.selectedCategory = category
    this.backStack.push(category)
  }

  backToCategory(category: Category) {
    this.selectedCategory = category
    const index = this.backStack.indexOf(category)
    if (index !== -1) {
      this.backStack.splice(index + 1)
    }
  }

  getSelectedCategoryDatasets() {
    return this.categories2datasets?.[this.selectedCategory?.id]
  }

  /**
   * Assigns datasets and dataset counts to categories.
   * @param category
   */
  assignDatasetsToCategories(category: Category): number {
    category.datasets = this.categories2datasets?.[category.id]
    let total = category.datasets ? category.datasets.length : 0
    category?.categories?.forEach(subcategory => total += this.assignDatasetsToCategories(subcategory))
    category.datasets_count = total
    return total
  }

  private getDatasetMap(datasets: Dataset[]): DatasetMap {
    return datasets.reduce<DatasetMap>((acc, dataset) => {
      acc[dataset.id] = dataset
      return acc
    }, {})
  }

  private getCategoryToDatasetsMapping(datasets: Dataset[]): DatasetsMap {
    const cat2datasets: DatasetsMap = {}
    datasets?.forEach(dataset => {
      dataset?.categories?.forEach(categoryId => {
        if (!cat2datasets[categoryId]) cat2datasets[categoryId] = []
        cat2datasets[categoryId].push(dataset)
      })
    })
    return cat2datasets
  }
}
