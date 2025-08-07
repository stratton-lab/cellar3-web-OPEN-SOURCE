import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Observable, of} from "rxjs";
import {SelectedGene} from "../analysis/diff-expression/volcano/volcano";
import {NGXLogger} from "ngx-logger";
import {Search} from "../search";

@Component({
  selector: 'gene-search',
  templateUrl: './gene-search.component.html',
  styleUrls: ['./gene-search.component.scss']
})
export class GeneSearchComponent {

  @Input() backend: Function
  @Output() onGeneSelected = new EventEmitter<SelectedGene>()
  @Output() onGeneHovered = new EventEmitter<SelectedGene>()

  searcher: Search<SelectedGene>

  constructor(private logger: NGXLogger) {
    this.searcher = new Search<SelectedGene>(1, this.getResults)
  }

  getResults = (query: string): Observable<SelectedGene[]> => of(this.backend(query))

  selectGene(gene: SelectedGene) {
    this.searcher.reset()
    this.onGeneSelected?.next(gene)
  }

  showGene = (gene: SelectedGene) => this.onGeneHovered?.next(gene)


  getTooltip(gene: SelectedGene): string {
    if (gene.logFC != null && gene.minusLogP != null) {
      return 'LogFC: ' + gene.logFC?.toFixed(1) + '  -LogP: ' + gene.minusLogP?.toFixed(1)
    }
    return "Click to show gene expression."
  }
}
