import {Component} from '@angular/core';
import {faClock} from '@fortawesome/free-solid-svg-icons';
import {DashHeader} from './components/dash-header/dash-header';
import {DashFooter} from './components/dash-footer/dash-footer';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    DashHeader,
    DashFooter,
    RouterOutlet
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss'
})
export class DashboardPage {

 faClock = faClock;
}
