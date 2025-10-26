import {Component, computed, inject, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Exercise, ExerciseCard} from '../../../../../shared/components/exercise-card/exercise-card';

@Component({
  selector: 'app-exercise-list-page',
  imports: [
    ExerciseCard
  ],
  templateUrl: './exercise-list-page.html',
  styleUrl: './exercise-list-page.scss'
})
export class ExerciseListPage {
  private route = inject(ActivatedRoute);

  exercises = signal<Exercise[]>([]);
  selectedExercises = signal<Set<string>>(new Set());

  filteredExercises = computed(() => this.exercises());

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const muscleGroup = params['muscleGroup'];
      this.loadExercises(muscleGroup);
    });
  }

  loadExercises(muscleGroup: string): void {
    // TODO: Завантаж з API
    this.exercises.set([
      {
        id: '1',
        name: 'bench press',
        gifUrl: 'assets/img/bench-mini.jpg',
        bodyPart: 'chest',
        equipment: 'dumbbell',
        target: 'pectorals'
      },
      {
        id: '2',
        name: '30-degree incline dumbbell fly',
        gifUrl: 'https://example.com/exercise2.gif',
        bodyPart: 'chest',
        equipment: 'dumbbell',
        target: 'pectorals'
      }
    ]);
  }

  isExerciseSelected(exerciseId: string): boolean {
    return this.selectedExercises().has(exerciseId);
  }

  onExerciseSelected(event: { exercise: Exercise; selected: boolean }): void {
    const selected = new Set(this.selectedExercises());

    if (event.selected) {
      selected.add(event.exercise.id);
    } else {
      selected.delete(event.exercise.id);
    }

    this.selectedExercises.set(selected);
  }
}
