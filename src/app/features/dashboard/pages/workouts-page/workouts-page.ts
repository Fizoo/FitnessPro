import {Component} from '@angular/core';
import {MyProgramPage} from '../dashboard-main-page/components/my-program-page/my-program-page';
import {TrainingCardWrapper} from '../../../../shared/components/training-card-wrapper/training-card-wrapper';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';


@Component({
  selector: 'app-workouts-page',
  imports: [
    MyProgramPage,
    TrainingCardWrapper,
    MatIcon,
    MatIconButton,

  ],
  templateUrl: './workouts-page.html',
  standalone: true,
  styleUrl: './workouts-page.scss'
})
export class WorkoutsPage {

}
