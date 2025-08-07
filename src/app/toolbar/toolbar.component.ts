import {Component, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  isDEV = () => !environment.production || window?.location?.href?.includes('dev-open')

}
