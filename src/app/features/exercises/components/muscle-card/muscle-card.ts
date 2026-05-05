import {Component, input, output} from '@angular/core';
import {NgOptimizedImage, UpperCasePipe} from '@angular/common';
import {IBodyPart} from '../../../../core/store/Body.part.store';


@Component({
    selector: 'app-muscle-card',
    imports: [
        UpperCasePipe,
        NgOptimizedImage
    ],
    templateUrl: './muscle-card.html',
    standalone: true,
    styleUrl: './muscle-card.scss'
})
export class MuscleCard {

  muscleGroup = input.required<IBodyPart>();
  routedTo=output<string>()

  onSelect() {
    this.routedTo.emit(this.muscleGroup().name)
  }
}
