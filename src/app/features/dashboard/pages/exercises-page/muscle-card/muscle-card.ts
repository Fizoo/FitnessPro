import {Component, input, output} from '@angular/core';
import {NgOptimizedImage, UpperCasePipe} from '@angular/common';
import {IMuscleGroup} from '../../../../../core/model/Exercise-model';


@Component({
  selector: 'app-muscle-card',
  imports: [
    UpperCasePipe,
    NgOptimizedImage
  ],
  templateUrl: './muscle-card.html',
  styleUrl: './muscle-card.scss'
})
export class MuscleCard {

  muscleGroup = input.required<IMuscleGroup>();
  routedTo=output<string>()

  onSelect() {
    this.routedTo.emit(this.muscleGroup().name)
  }
}
