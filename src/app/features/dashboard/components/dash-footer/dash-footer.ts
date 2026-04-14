import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-dash-footer',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './dash-footer.html',
  styleUrl: './dash-footer.scss'
})
export class DashFooter {

}
