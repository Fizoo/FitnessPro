import {Component} from '@angular/core';
import {MyProgramPage} from './components/my-program-page/my-program-page';
import {NextTrainingPage} from './components/next-training-page/next-training-page';

@Component({
  selector: 'app-dashboard-main-page',
  imports: [
    MyProgramPage,
    NextTrainingPage
  ],
  templateUrl: './dashboard-main-page.html',
  styleUrl: './dashboard-main-page.scss'
})
export class DashboardMainPage {

  workoutsNumber: number=0
}
