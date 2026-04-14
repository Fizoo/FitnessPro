import {Component, inject} from '@angular/core';
import {MyProgramPage} from '../dashboard-main-page/components/my-program-page/my-program-page';
import {TrainingCardWrapper} from '../../../workouts/pages/training-card-wrapper/training-card-wrapper';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Router} from '@angular/router';


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
  router=inject(Router)

  protected openDay(dayId: number) {
    this.router.navigate(['workout-day', dayId]);
  }
}
