import {Component, computed, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {WORKOUT_DAYS} from '../../../../shared/workout.mock';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-exercise-work-detail-component',
  imports: [
    MatSlideToggle,
    FormsModule,
    DecimalPipe
  ],
  templateUrl: './exercise-work-detail-component.html',
  styleUrl: './exercise-work-detail-component.scss',
})
export class ExerciseWorkDetailComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  exerciseId = toSignal(this.route.params.pipe(map(p => p['exerciseId'])));
  dayId = toSignal(this.route.params.pipe(map(p => +p['dayId'])));

  exercise = computed(() => {
    const day = WORKOUT_DAYS.find(d => d.id === this.dayId()) ?? WORKOUT_DAYS[0];
    return day.exercises.find(e => e.id === this.exerciseId()) ?? day.exercises[0];
  });

  type = signal<'straight' | 'pyramid'>('straight');
  unit = signal<'kg' | '%'>('kg');
  noRest = false;
  comment = '';

  restMinutes = signal(2);
  restSeconds = signal(0);

  history = signal([
    {
      date: 'Tue, 31/03/2026',
      sets: [
        { num: 3, weight: 10, reps: 10, time: '15:46' },
        { num: 2, weight: 10, reps: 10, time: '15:42' },
        { num: 1, weight: 10, reps: 10, time: '15:39' },
      ]
    },
    {
      date: 'Sat, 28/03/2026',
      sets: [
        { num: 3, weight: 10, reps: 10, time: '11:20' },
        { num: 2, weight: 10, reps: 10, time: '11:15' },
        { num: 1, weight: 10, reps: 10, time: '11:10' },
      ]
    },
  ]);

  goBack() { this.router.navigate(['../'], { relativeTo: this.route }); }
  save() { this.goBack(); }
}
