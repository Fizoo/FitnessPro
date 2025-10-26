import {Component, Input} from '@angular/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {ProgressColorSpinnerDirective} from '../../directives/progress-color-spinner';


@Component({
  selector: 'app-training-card-wrapper',
  imports: [
    MatProgressSpinner,
    ProgressColorSpinnerDirective
  ],
  templateUrl: './training-card-wrapper.html',
  styleUrl: './training-card-wrapper.scss'
})
export class TrainingCardWrapper {
  @Input() progress: number = 90;
  @Input() day: string = '0';
  @Input() title: string = 'Bench';
  @Input() hasIndicator: boolean = true;
}
