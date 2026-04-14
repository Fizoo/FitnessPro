import {Component} from '@angular/core';
import {TrainingCardWrapper} from '../../../../../workouts/pages/training-card-wrapper/training-card-wrapper';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-next-training-page',
  imports: [
    TrainingCardWrapper,
    RouterLink
  ],
    templateUrl: './next-training-page.html',
    standalone: true,
    styleUrl: './next-training-page.scss'
})
export class NextTrainingPage {


}
