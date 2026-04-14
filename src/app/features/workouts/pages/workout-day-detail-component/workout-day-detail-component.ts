import {Component, computed, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {WORKOUT_DAYS} from '../../../../shared/workout.mock';
import {StaticGif} from '../../../../shared/directives/static-gif';

@Component({
  selector: 'app-workout-day-detail-component',
  imports: [
    StaticGif
  ],
  templateUrl: './workout-day-detail-component.html',
  styleUrl: './workout-day-detail-component.scss',
})
export class WorkoutDayDetailComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  dayId = toSignal(this.route.params.pipe(map(p => +p['dayId'])));

  day = computed(() =>
    WORKOUT_DAYS.find(d => d.id === this.dayId()) ?? WORKOUT_DAYS[0]
  );

  estimatedTime = computed(() => this.day().exercises.length * 15);

  progressColor(p: number): string {
    if (p >= 80) return '#66BB6A';
    if (p >= 50) return '#FFA726';
    return '#EF5350';
  }

  goBack() { this.router.navigate(['/dashboard/workouts'], { relativeTo: this.route }); }

  openExercise(exId: string) {
    this.router.navigate([exId], { relativeTo: this.route });
  }

  startWorkout() {
    this.router.navigate([this.day().exercises[0].id], { relativeTo: this.route });
  }
}
