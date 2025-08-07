import {Component, Input} from '@angular/core';
import {ChartData, ChartOptions} from 'chart.js';
import {FacetField} from "../docsum/facet/facet.interface";
import {getChartColors} from "../colors";
import {NgChartsModule} from "ng2-charts";

@Component({
  selector: 'chart-donut',
  standalone: true,
  templateUrl: './chart-donut.component.html',
  imports: [
    NgChartsModule
  ],
  styleUrls: ['./chart-donut.component.scss']
})
export class ChartDonutComponent {

  name: string

  data: ChartData<'doughnut'> = {
    labels: [],
    datasets: []
  }

  @Input() set chartInputData(facetField: FacetField) {
    this.name = facetField.name;
    this.data = this.toDoughnutChartData(facetField)
  }

  options: ChartOptions<'doughnut'> = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    }
  }

  toDoughnutChartData(facetField: FacetField): ChartData<'doughnut'> {
    return {
      labels: facetField.items.map(e => e.name),
      datasets: [
        {
          data: facetField.items.map(e => e.count || 0),
          backgroundColor: getChartColors(facetField.items.length),
          borderRadius: 10
        }
      ]
    }
  }

}
