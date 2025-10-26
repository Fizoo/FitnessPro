import {Component} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-dash-header',
  imports: [
    MatButton,

    RouterLink
  ],
  templateUrl: './dash-header.html',
  styleUrl: './dash-header.scss'
})
export class DashHeader {

  goBack() {

  }
}
