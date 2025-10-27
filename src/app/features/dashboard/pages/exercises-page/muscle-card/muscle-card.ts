import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IMuscleGroup} from '../../../../../core/model/Exercise-model';
import {UpperCasePipe} from '@angular/common';


@Component({
  selector: 'app-muscle-card',
  imports: [
    UpperCasePipe
  ],
  templateUrl: './muscle-card.html',
  styleUrl: './muscle-card.scss'
})
export class MuscleCard {

  @Input({ required: true }) muscleGroup!: IMuscleGroup;
  @Output() selected = new EventEmitter<IMuscleGroup>();

  onSelect(): void {
    this.selected.emit(this.muscleGroup);
  }
}
