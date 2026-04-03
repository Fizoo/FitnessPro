import {Component, Input} from '@angular/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';


@Component({
    selector: 'app-training-card-wrapper',
    imports: [
        MatProgressSpinner
    ],
    templateUrl: './training-card-wrapper.html',
    standalone: true,
    styleUrl: './training-card-wrapper.scss'
})
export class TrainingCardWrapper {
  @Input() progress: number = 90;
  @Input() day: string = '0';
  @Input() title: string = 'Bench';
  @Input() hasIndicator: boolean = true;


  getProgressColor(progress: number): string {
    if (progress >= 85) return '#26c6da';
    if (progress >= 75) return '#4db6ac';
    if (progress >= 65) return '#9ccc65';
    if (progress >= 55) return '#d4a574';
    return '#ef5350';
  }
}
