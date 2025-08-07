import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {facetTooltips} from './facet-tooltip';
import {ToggleFacetEvent} from './toggle-event';
import {FacetField, FacetValue} from "./facet.interface";

@Component({
  selector: 'facet',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './facet.component.html',
  styleUrls: ['./facet.component.scss']
})
export class FacetComponent {

  @Input()
  facet: FacetField

  @Input()
  filters: Record<string, Set<string>>

  @Output()
  onToggled = new EventEmitter<ToggleFacetEvent>()

  isSelected = (value: string) => this.filters[this.facet.field]?.has(value)

  isSubFacetSelected = (field: string, value: string) => this.filters[field]?.has(value)

  isSubFacetActive = (field: string | null, item: FacetValue) => field && item.count && item.count > 0

  toggleFacet(value: FacetValue) {
    this.onToggled.emit({field: this.facet.field, value: value})
  }

  toggleSubFacet(field: string | null, value: FacetValue) {
    if (field && value.count) this.onToggled.emit({field: field, value: value})
  }

  getTooltip(item: FacetValue) {
    return facetTooltips[this.facet.field]?.[item.name] || item.name
  }
}
