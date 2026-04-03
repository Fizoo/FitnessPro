import {Component, computed, inject, signal} from '@angular/core';
import {ExerciseCard} from '../../../../../shared/components/exercise-card/exercise-card';
import {ActivatedRoute, Router} from '@angular/router';
import {IExercise} from '../../../../../core/model/Exercise-model';
import {exercisesData} from '../../../../../../../public/data/data';


@Component({
  selector: 'app-exercise-list-page',
  imports: [
    ExerciseCard

  ],
  templateUrl: './exercise-list-page.html',
  standalone: true,
  styleUrl: './exercise-list-page.scss'
})
export class ExerciseListPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  bodyPart = this.route.snapshot.paramMap.get('muscleGroup');
  list = computed(() => exercisesData.find(g => g.params === this.bodyPart)?.data ?? []);

  selectedExercises = signal<string[]>([]);
 // list=signal(exercisesData)


  onExerciseSelected(exercise: IExercise): void {
    this.router.navigate([exercise.id], { relativeTo: this.route });
  }

  isExerciseSelected(exerciseId: string): boolean {
    return this.selectedExercises().includes(exerciseId);
  }
}
