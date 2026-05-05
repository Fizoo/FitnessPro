import {Component, input, OnInit, output} from '@angular/core';
import {IExercise} from '../../../../core/model/Exercise-model';
import {StaticGif} from '../../../../shared/directives/static-gif';


@Component({
  selector: 'app-exercise-card',
  imports: [
    StaticGif,
  ],
  templateUrl: './exercise-card.html',
  standalone: true,
  styleUrl: './exercise-card.scss'
})
export class ExerciseCard implements OnInit{
  ngOnInit(): void {

  }
  exercise = input.required<IExercise>()
  isSelected = input<boolean>(false);
  mode = input<'default' | 'picker'>('default');



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
