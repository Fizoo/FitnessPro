import {Component, computed, inject, input, signal} from '@angular/core';
import {Router} from '@angular/router';


const MOCK_WORKOUTS: WorkoutDay[] = [
  { date: '2026-04-02', name: 'Bench & Biceps', progress: 57 },
  { date: '2026-04-05', name: 'Full Back', progress: 93 },
  { date: '2026-04-08', name: 'Legs', progress: 45 },
  { date: '2026-04-10', name: 'Shoulders', progress: 30 },
  { date: '2026-04-14', name: 'Chest', progress: 80 },
  { date: '2026-04-18', name: 'Arms', progress: 65 },
];

export interface WorkoutDay {
  date: string; // 'YYYY-MM-DD'
  name: string;
  progress: number; // 0-100
}

interface CalCell {
  day: number;
  key: string;
  otherMonth: boolean;
  isToday: boolean;
  workout?: WorkoutDay;
}

@Component({
  selector: 'app-calendar',
  imports: [],
  standalone: true,
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar {

  private readonly router = inject(Router);

  workouts = input<WorkoutDay[]>([
    { date: '2026-04-02', name: 'Bench & Biceps', progress: 57 },
    { date: '2026-04-05', name: 'Full Back', progress: 93 },
    { date: '2026-04-08', name: 'Legs', progress: 45 },
    { date: '2026-04-10', name: 'Shoulders', progress: 30 },
    { date: '2026-04-14', name: 'Chest', progress: 80 },
    { date: '2026-04-18', name: 'Arms', progress: 65 },
  ]);

  currentDate = signal(new Date());
  readonly DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  monthLabel = computed(() => {
    return this.currentDate().toLocaleString('en', { month: 'long', year: 'numeric' });
  });

  cells = computed<CalCell[]>(() => {
    const map = new Map(this.workouts().map(w => [w.date, w]));
    const d = this.currentDate();
    const y = d.getFullYear(), m = d.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const daysInPrev = new Date(y, m, 0).getDate();
    const today = new Date();

    let total = offset + daysInMonth;
    if (total % 7 !== 0) total += 7 - (total % 7);

    return Array.from({ length: total }, (_, i) => {
      let day: number, mo = m, yr = y, otherMonth = false;
      if (i < offset) {
        day = daysInPrev - offset + i + 1; mo = m - 1; otherMonth = true;
        if (mo < 0) { mo = 11; yr--; }
      } else if (i >= offset + daysInMonth) {
        day = i - offset - daysInMonth + 1; mo = m + 1; otherMonth = true;
        if (mo > 11) { mo = 0; yr++; }
      } else {
        day = i - offset + 1;
      }
      const key = `${yr}-${String(mo + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = today.getFullYear() === yr && today.getMonth() === mo && today.getDate() === day;
      return { day, key, otherMonth, isToday, workout: map.get(key) };
    });
  });

  changeMonth(dir: number) {
    const d = new Date(this.currentDate());
    d.setMonth(d.getMonth() + dir);
    this.currentDate.set(d);
  }

  progressColor(p: number): string {
    if (p >= 90) return '#4caf50';
    if (p >= 70) return '#8bc34a';
    if (p >= 50) return '#ffc107';
    if (p >= 30) return '#ff9800';
    return '#f44336';
  }

  onDayClick(cell: CalCell) {
    if (!cell.workout) return;
    this.router.navigate(['/result', cell.key]);
  }

}
