import {ChangeDetectorRef, Component, effect, inject, signal} from '@angular/core';
import {firstValueFrom, map} from 'rxjs';
import {IExercise} from '../../../core/model/Exercise-model';
import {rxResource} from '@angular/core/rxjs-interop';
import {ExerciseService} from '../../../core/services/exercise-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-exercise-card-work',
  imports: [],
  templateUrl: './exercise-card-work.html',
  styleUrl: './exercise-card-work.scss'
})
export class ExerciseCardWork {
  private readonly exerciseService = inject(ExerciseService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  // ---------- ROUTE PARAMS (приклад: /exercise/:muscleGroup/:exerciseId) ----------
  userParams = signal(() => {
    const segments = this.router.url.split('/').filter(Boolean);
    const exerciseId = segments[segments.length - 1] || '';
    const muscleGroup = segments[segments.length - 2] || '';
    return { exerciseId, muscleGroup };
  }) as any;

  // ---------- IMAGE BLOB URL ----------
  imgSrc = signal<string | null>(null);

  // ---------- HEADER STATE ----------
  currentIndex = signal(1);           // поточна вправа (1/7)
  totalExercisesSignal = signal(7);   // всього вправ
  currentMuscleGroup = signal('Back');
  totalWorkoutTime = signal('0:26');  // сумарний час тренування

  // Геттери для шаблону (щоб не плутатись з () у template)
  totalExercises() {
    return this.totalExercisesSignal();
  }

  // ---------- CIRCLES STATE ----------
  // 1. Repeats required (статичне)
  targetReps = signal(3);

  // 2. Rest timer
  private readonly REST_TOTAL_SECONDS = 20; // 2 хв
  private restSecondsLeft = signal(this.REST_TOTAL_SECONDS);
  readonly restCircumference = 2 * Math.PI * 45; // r = 45 у SVG

  // 0..1 (0 — нема часу, 1 — 100%)
  private restProgress = signal(1);

  restDashOffset = () =>
    this.restCircumference * (1 - this.restProgress());

  restTimeLeft() {
    const sec = this.restSecondsLeft();
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  // 3. Sets done progress
  totalSets = signal(12);
  setsDone = signal(0);
  readonly setsCircumference = 2 * Math.PI * 45;

  setsDashOffset = () =>
    this.setsCircumference * (1 - this.setsDone() / this.totalSets());

  // ---------- INPUT TILES ----------
  weight = signal(1);      // кг
  repsPerSet = signal(12); // повтори

  // ---------- DATA LOAD ----------
  readonly exercisesRx = rxResource<IExercise, { exerciseId: string; muscleGroup: string }>({
    params: () => this.userParams(),
    defaultValue: {} as IExercise,
    stream: ({ params }) =>
      this.exerciseService.getExercisesByBodyPart(params.muscleGroup).pipe(
        map(exercises => {
          const ex = exercises.find(
            e => String(e.id) === String(params.exerciseId)
          );
          return ex ? ex : ({} as IExercise);
        })
      )
  });

  constructor() {
    // автоматично підтягувати GIF/картинку коли змінилась вправа
    effect(async () => {
      const ex = this.exercisesRx.value();
      if (!ex || !ex.id) return;

      const prevUrl = this.imgSrc();
      if (prevUrl) URL.revokeObjectURL(prevUrl);

      try {
        const blob = await firstValueFrom(
          this.exerciseService.getExerciseImageBlob(String(ex.id), '180')
        );
        const url = URL.createObjectURL(blob);
        this.imgSrc.set(url);
        this.cdr.markForCheck();
      } catch (err) {
        console.error('Failed to load exercise image', err);
        this.imgSrc.set(null);
        this.cdr.markForCheck();
      }
    });

    // простий старт таймера відпочинку (демо).
    // У реалі можна запускати при натисканні "Begin".
    this.startRestTimer();
  }

  // ---------- TIMER LOGIC ----------
  private timerId: any;

  private startRestTimer() {
    if (this.timerId) clearInterval(this.timerId);

    this.restSecondsLeft.set(this.REST_TOTAL_SECONDS);
    this.restProgress.set(1);

    this.timerId = setInterval(() => {
      const left = this.restSecondsLeft() - 1;
      if (left <= 0) {
        this.restSecondsLeft.set(0);
        this.restProgress.set(0);
        clearInterval(this.timerId);
      } else {
        this.restSecondsLeft.set(left);
        this.restProgress.set(left / this.REST_TOTAL_SECONDS);
      }
      this.cdr.markForCheck();
    }, 1000);
  }

  // ---------- INPUT HANDLERS ----------
  onWeightChange(event: Event) {
    const v = +(event.target as HTMLInputElement).value || 0;
    this.weight.set(v);
  }

  onRepsChange(event: Event) {
    const v = +(event.target as HTMLInputElement).value || 1;
    this.repsPerSet.set(v);
  }

  onAddSet() {
    const done = this.setsDone();
    if (done < this.totalSets()) {
      this.setsDone.set(done + 1);
    }
    // тут потім додаси push в історію, restart таймера тощо
  }

  // ---------- NAV ----------
  goBack() {
    this.router.navigate(['/workouts']); // свій маршрут
  }

  ngOnDestroy() {
    const url = this.imgSrc();
    if (url) URL.revokeObjectURL(url);
    if (this.timerId) clearInterval(this.timerId);
  }

}
