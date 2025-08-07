import {Component, OnInit} from '@angular/core';
import {Message} from "../message";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  busy = false
  msg: Message | null = null

  constructor() {
  }

}
