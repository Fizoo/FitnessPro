import {Component, inject, resource, signal} from '@angular/core';
import {ExerciseCard} from '../../../../../shared/components/exercise-card/exercise-card';
import {ActivatedRoute, Router} from '@angular/router';
import {Alert} from '../../../../../shared/components/alert/alert';
import {Spinner} from '../../../../../shared/components/spinner/spinner';
import {ExerciseService} from '../../../../../core/services/exercise-service';
import {firstValueFrom, map} from 'rxjs';
import {IExercise} from '../../../../../core/model/Exercise-model';
import {toSignal} from '@angular/core/rxjs-interop';
import {exercisesData} from '../../../../../../../public/data/data';


@Component({
  selector: 'app-exercise-list-page',
  imports: [
    ExerciseCard,
    Alert,
    Spinner

  ],
  templateUrl: './exercise-list-page.html',
  styleUrl: './exercise-list-page.scss'
})
export class ExerciseListPage {
  private route = inject(ActivatedRoute);
  private exercisesService = inject(ExerciseService);
  private router = inject(Router);

  selectedExercises = signal<string[]>([]);
  list=signal(exercisesData)

  // Отримуємо bodyPart з route params
  bodyPart = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('muscleGroup') || 'chest')
    )
  );

  // Resource з реактивним параметром + generic типи
  onExercisesRecourse = resource<IExercise[],void>({
    loader: () =>
      firstValueFrom(this.exercisesService.getExercisesByBodyPart(this.bodyPart()!))
  });

  onExerciseSelected(exercise: IExercise): void {
    this.router.navigate([exercise.id], { relativeTo: this.route });
  }

  isExerciseSelected(exerciseId: string): boolean {
    return this.selectedExercises().includes(exerciseId);
  }



/*  private route = inject(ActivatedRoute);
  exercisesService = inject(ExerciseService)
  isLoading = signal(false);

  exercises = signal<IExercise[]>([]);
  selectedExercises = signal<Set<string>>(new Set());

  filteredExercises = computed(() => this.exercises());

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const muscleGroup = params['muscleGroup'];

    });
    this.loadExercises();
  }

  loadExercises(): void {
    this.isLoading.set(true);

    // В компоненті
    this.exercisesService.getExercisesByBodyPart('back')
      .subscribe(exercise => {
        this.exercises.set(exercise)
        console.log(exercise)
      });


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
  }*/


}
