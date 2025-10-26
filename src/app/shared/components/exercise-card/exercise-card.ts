import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Router} from '@angular/router';


export interface Exercise {
  id: string;
  name: string;
  gifUrl: string;
  bodyPart: string;
  equipment: string;
  target: string;
}
@Component({
  selector: 'app-exercise-card',
  imports: [],
  templateUrl: './exercise-card.html',
  styleUrl: './exercise-card.scss'
})
export class ExerciseCard {
  @Input({ required: true }) exercise!: Exercise;
  @Input() isSelected: boolean = false;

  @Output() selected = new EventEmitter<{ exercise: Exercise; selected: boolean }>();


  private router = inject(Router);


  onSelect(): void {
    //this.router.navigate([this.exercise.id], { relativeTo: this.route });
    this.router.navigate([this.exercise.bodyPart,this.exercise.id]);
   // this.selected.emit({ exercise: this.exercise, selected: !this.isSelected });
  }

  onCheckboxClick(event: Event): void {
    event.stopPropagation();

    this.selected.emit({ exercise: this.exercise, selected: !this.isSelected });
  }
}
