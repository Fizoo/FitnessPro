// workout-result.component.ts
import {Component, computed, inject, signal} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {ProgressColorPipe} from '../../../../shared/pipes/progress-color-pipe';

export interface ExerciseResult {
  id: string;
  name: string;
  gifUrl?: string;
  totalRepeats: number;
  totalKg: number;
}

export interface WorkoutResult {
  date: string;         // 'YYYY-MM-DD'
  time: string;         // '11:24'
  dayNumber: number;    // 51
  dayName: string;      // 'Bench*&Biceps 9'
  progress: number;     // 57
  durationMin: number;  // 55
  durationSec: number;  // 9
  avgRestMin: number;   // 3
  avgRestSec: number;   // 26
  calories: number;
  repsMade: number;
  repsExpected: number;
  weightLifted: number;
  weightExpected: number;
  exercises: ExerciseResult[];
}

export const MOCK_WORKOUT_RESULT: WorkoutResult = {
  date: '2026-04-02',
  time: '11:24',
  dayNumber: 51,
  dayName: 'Bench*&Biceps 9',
  progress: 77,
  durationMin: 55,
  durationSec: 9,
  avgRestMin: 3,
  avgRestSec: 26,
  calories: 65,
  repsMade: 155,
  repsExpected: 206,
  weightLifted: 2715,
  weightExpected: 8068.5,
  exercises: [
    { id: '0009', name: 'Machine bent arm chest fly', totalRepeats: 45, totalKg: 2475 },
    { id: '0042', name: 'Inside grip EZ-bar curl',    totalRepeats: 40, totalKg: 2100 },
    { id: '0017', name: 'Seated dumbbell curl',       totalRepeats: 30, totalKg: 1080 },
    { id: '0033', name: 'Decline crunch',             totalRepeats: 60, totalKg: 60   },
  ]
};

@Component({
  selector: 'app-workout-result',
  standalone: true,
  imports: [DecimalPipe, ProgressColorPipe],
  templateUrl: './workout-result-component.html',
  styleUrl: './workout-result-component.scss'
})
export class WorkoutResultComponent {
  private readonly route = inject(ActivatedRoute);

  date = this.route.snapshot.paramMap.get('date'); // '2026-04-02'

  // потім підтягуєш дані по цій даті з сервісу/стору
  result = signal<WorkoutResult>(MOCK_WORKOUT_RESULT);

  dateLabel = computed(() => {
    const r = this.result();
    const d = new Date(r.date);
    return d.toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' }) + ' • ' + r.time;
  });

  duration = computed(() => {
    const r = this.result();
    return `${r.durationMin}:${String(r.durationSec).padStart(2, '0')}`;
  });

  avgRest = computed(() => {
    const r = this.result();
    return `${r.avgRestMin}:${String(r.avgRestSec).padStart(2, '0')}`;
  });

  repsPercent = computed(() => Math.round(this.result().repsMade / this.result().repsExpected * 100));
  weightPercent = computed(() => Math.round(this.result().weightLifted / this.result().weightExpected * 100));

  circumference = 2 * Math.PI * 22; // r=22

  dashOffset(percent: number): number {
    return this.circumference * (1 - percent / 100);
  }

  gifUrl(id: string): string {
    return `assets/gifs/exercise_${id}.gif`;
  }

  goBack() { history.back(); }
  share() { console.log('share'); }
  delete() { console.log('delete'); }
}
