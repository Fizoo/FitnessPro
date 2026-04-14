import {Component} from '@angular/core';
import {MyProgramPage} from './components/my-program-page/my-program-page';
import {NextTrainingPage} from './components/next-training-page/next-training-page';
import {Calendar} from './calendar/calendar';
import {AnalyticsComponent} from '../../../AnalyticsPage/analytics-component/analytics-component';

@Component({
  selector: 'app-dashboard-main-page',
  standalone: true,
  imports: [
    MyProgramPage,
    NextTrainingPage,
    Calendar,
    AnalyticsComponent
  ],
  templateUrl: './dashboard-main-page.html',
  styleUrl: './dashboard-main-page.scss'
})
export class DashboardMainPage {
  workoutsNumber: number=0
}
