import {Component, input, output} from '@angular/core';
import {IExercise} from '../../../core/model/Exercise-model';


@Component({
  selector: 'app-exercise-card',
  imports: [

  ],
  templateUrl: './exercise-card.html',
  styleUrl: './exercise-card.scss'
})
export class ExerciseCard {
  exercise=input.required<IExercise>()
  isSelected=input<boolean>(false)

  selected = output<IExercise>();
  checkboxToggled = output<{ exercise: IExercise; selected: boolean }>();

  onSelect(): void {

    this.selected.emit(this.exercise());
  }
  onCheckboxClick(event: Event): void {
    event.stopPropagation();
    this.checkboxToggled.emit({
      exercise: this.exercise(),
      selected: !this.isSelected()
    });
  }

}
