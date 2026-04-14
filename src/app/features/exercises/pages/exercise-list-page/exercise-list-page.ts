import {Component, effect, ElementRef, inject, OnDestroy, OnInit, viewChild} from '@angular/core';
import {ExerciseCard} from '../../components/exercise-card/exercise-card';
import {ActivatedRoute, Router} from '@angular/router';
import {IExercise} from '../../../../core/model/Exercise-model';
import {ExerciseStore} from '../../../../core/store/exercise.store';


@Component({
  selector: 'app-exercise-list-page',
  imports: [
    ExerciseCard

  ],
  templateUrl: './exercise-list-page.html',
  standalone: true,
  styleUrl: './exercise-list-page.scss'
})
export class ExerciseListPage implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected store=inject(ExerciseStore)

  private sentinel = viewChild<ElementRef>('sentinel');
  private observer?: IntersectionObserver;

  constructor() {
    effect(() => {
      const el = this.sentinel()?.nativeElement;
      if (el) this.setupObserver(el);
    });
  }
  ngOnInit(): void {
    const bodyPart = this.route.snapshot.paramMap.get('muscleGroup')!;
    this.store.loadByBodyPart(bodyPart);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
  onExerciseSelected(exercise: IExercise): void {
    this.router.navigate([exercise.id], { relativeTo: this.route });
  }

  private setupObserver(el: HTMLElement): void {
    this.observer?.disconnect();
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) this.store.loadMore();
      },
      { threshold: 0.1 }
    );
    this.observer.observe(el);
  }

/*  private route = inject(ActivatedRoute);
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
  }*/
}
