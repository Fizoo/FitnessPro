import {Component, computed, inject, OnDestroy, signal} from '@angular/core';
import {Router} from '@angular/router';
import {IExercise} from '../../../../core/model/Exercise-model';
import {exercisesData} from '../../../../../../public/data/data';

@Component({
  selector: 'app-exercise-card-work',
  standalone: true,
  imports: [],
  templateUrl: './exercise-card-work.html',
  styleUrl: './exercise-card-work.scss'
})
export class ExerciseCardWork implements OnDestroy {
  private readonly router = inject(Router);

  // ---------- INPUTS ----------
  exercises = signal<IExercise[]>(exercisesData[8].data); // тимчасово для тесту

  // ---------- CURRENT EXERCISE ----------
  currentIndex = signal(0);
  currentExercise = computed(() => this.exercises()[this.currentIndex()]);
  totalExercises = computed(() => this.exercises().length);

  // ---------- CIRCLES ----------
  targetReps = signal(3);

  private readonly REST_TOTAL = 20;
  private restSecondsLeft = signal(this.REST_TOTAL);
  readonly restCircumference = 2 * Math.PI * 45;
  restProgress = signal(1);

  restDashOffset = computed(() => this.restCircumference * (1 - this.restProgress()));

  restTimeLeft = computed(() => {
    const sec = this.restSecondsLeft();
    return `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;
  });

  totalSets = signal(12);
  setsDone = signal(0);
  readonly setsCircumference = 2 * Math.PI * 45;
  setsDashOffset = computed(() => this.setsCircumference * (1 - this.setsDone() / this.totalSets()));

  // ---------- INPUTS ----------
  weight = signal(1);
  repsPerSet = signal(12);

  // ---------- SWIPE ----------
  private touchStartX = 0;
  private touchStartY = 0;

  onTouchStart(e: TouchEvent | MouseEvent) {
    if (e instanceof TouchEvent) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    } else {
      this.touchStartX = e.clientX;
      this.touchStartY = e.clientY;
    }
  }

  onTouchEnd(e: TouchEvent | MouseEvent) {
    let endX: number, endY: number;
    if (e instanceof TouchEvent) {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
    } else {
      endX = e.clientX;
      endY = e.clientY;
    }

    const diffX = this.touchStartX - endX;
    const diffY = Math.abs(this.touchStartY - endY);

    if (Math.abs(diffX) > 50 && diffY < 80) {
      if (diffX > 0) this.nextExercise();
      else this.prevExercise();
    }
  }

  nextExercise() {
    if (this.currentIndex() < this.totalExercises() - 1) {
      this.currentIndex.update(i => i + 1);
      this.resetState();
    }
  }

  prevExercise() {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(i => i - 1);
      this.resetState();
    }
  }

  private resetState() {
    this.setsDone.set(0);
    this.startRestTimer();
  }

  // ---------- TIMER ----------
  private timerId: any;

  private startRestTimer() {
    if (this.timerId) clearInterval(this.timerId);
    this.restSecondsLeft.set(this.REST_TOTAL);
    this.restProgress.set(1);

    this.timerId = setInterval(() => {
      const left = this.restSecondsLeft() - 1;
      if (left <= 0) {
        this.restSecondsLeft.set(0);
        this.restProgress.set(0);
        clearInterval(this.timerId);
      } else {
        this.restSecondsLeft.set(left);
        this.restProgress.set(left / this.REST_TOTAL);
      }
    }, 1000);
  }

  // ---------- HANDLERS ----------
  onWeightChange(e: Event) {
    this.weight.set(+(e.target as HTMLInputElement).value || 0);
  }

  onRepsChange(e: Event) {
    this.repsPerSet.set(+(e.target as HTMLInputElement).value || 1);
  }

  onAddSet() {
    if (this.setsDone() < this.totalSets()) {
      this.setsDone.update(v => v + 1);
      this.startRestTimer();
    }
  }

  goBack() {
    //this.router.back ? history.back() : this.router.navigate(['/']);
  }

  constructor() {
    this.startRestTimer();
  }

  ngOnDestroy() {
    if (this.timerId) clearInterval(this.timerId);
  }
}
