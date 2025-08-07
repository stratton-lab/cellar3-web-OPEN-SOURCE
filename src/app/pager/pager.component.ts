import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.css']
})
export class PagerComponent implements OnInit {

  @Input() previous: string | null

  @Input() next: string | null


  constructor() {
  }

  ngOnInit(): void {
  }

}
