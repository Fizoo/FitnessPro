import {Component, EventEmitter, Input, Output} from '@angular/core';


export interface MuscleGroup {
  id: number;
  name: string;
  image: string;
  exerciseCount?: number;
}

@Component({
  selector: 'app-muscle-card',
  imports: [],
  templateUrl: './muscle-card.html',
  styleUrl: './muscle-card.scss'
})
export class MuscleCard {

  @Input({ required: true }) muscleGroup!: MuscleGroup;
  @Output() selected = new EventEmitter<MuscleGroup>();

  onSelect(): void {
    this.selected.emit(this.muscleGroup);
  }
}
