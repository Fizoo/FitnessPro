import { Component, signal } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {TrainingCardWrapper} from '../../../workouts/pages/training-card-wrapper/training-card-wrapper';


export interface WorkoutDay {
  id: string;
  order: number;
  title: string;
  progress: number;
}

@Component({
  selector: 'app-workouts-edit',
  standalone: true,
  imports: [DragDropModule, MatIconModule, MatButtonModule, TrainingCardWrapper],
  templateUrl: 'workouts-edit.html',
  styleUrl: 'workouts-edit.scss',
})
export class WorkoutsEditComponent {
  programTitle = signal<string>('SplitPro 2026 x6');

  // TODO: замінити на дані з Firebase через signals store
  days = signal<WorkoutDay[]>([
    { id: '1', order: 1, title: 'Bench&Biceps&Triceps 1', progress: 95 },
    { id: '2', order: 2, title: 'Deltoids Full 1', progress: 83 },
    { id: '3', order: 3, title: 'Full back 1', progress: 96 },
    { id: '4', order: 4, title: 'Bench*&Biceps 1', progress: 98 },
    { id: '5', order: 5, title: 'Legs&Triceps 1', progress: 100 },
    { id: '6', order: 6, title: 'Back-&M-Delt 1', progress: 98 },
  ]);

  constructor(private location: Location, private router: Router) {}

  goBack(): void {
    this.location.back();
  }

  onDrop(event: CdkDragDrop<WorkoutDay[]>): void {
    const updated = [...this.days()];
    moveItemInArray(updated, event.previousIndex, event.currentIndex);
    updated.forEach((day, i) => (day.order = i + 1));
    this.days.set(updated);
  }

  onEdit(day: WorkoutDay): void {
    // TODO: navigate to edit day
    console.log('Edit:', day);
  }

  onDelete(dayId: string): void {
    this.days.update(days => days.filter(d => d.id !== dayId));
  }

  addTrainingDay(): void {
    this.router.navigate(['/new-workout']);
  }
  openDay(dayId: string): void {
    this.router.navigate(['/workout-day', dayId]);
  }

  onSave(): void {
    // TODO: зберегти порядок в Firebase
    console.log('Save:', this.days().map(d => ({ id: d.id, order: d.order })));
    this.location.back();
  }
}
