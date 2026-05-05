import {Component, computed, inject, signal} from '@angular/core';
import {DecimalPipe, Location} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';
import {IExercisePlan, ISetPlan, IWorkoutDay, IWorkoutProgram} from '../../../../core/model/workout-program.models';
import {MOCK_PROGRAM} from '../../../../core/model/workout-program.mock';
import {Router} from '@angular/router';
import {IExercise} from '../../../../core/model/Exercise-model';
import {ExerciseStore} from '../../../../core/store/exercise.store';

@Component({
  selector: 'app-workout-program',
  standalone: true,
  imports: [DecimalPipe, FormsModule, DragDropModule],
  templateUrl: './workout-program-component.html',
  styleUrl: './workout-program-component.scss'
})
export class WorkoutProgramComponent {
  private exerciseStore = inject(ExerciseStore);
  location = inject(Location);
  router = inject(Router);

  program = signal<IWorkoutProgram>(MOCK_PROGRAM);
  activeWeek = signal(0);
  showPicker = signal(false);
  addingToDayId = signal<string | null>(null);
  editingDayId = signal<string | null>(null);
  renameDayName = signal('');
  showCopyMenu = signal<string | null>(null);

  weeks = computed(() => this.program().weeks);
  currentWeekDays = computed(() => this.weeks()[this.activeWeek()]?.days ?? []);
  otherWeeks = computed(() =>
    this.weeks().map((w, i) => ({...w, idx: i})).filter((_, i) => i !== this.activeWeek())
  );

  // ── Exercises з NgRx Store ──
  getExercise(id: string): IExercise | undefined {
    return this.exerciseStore.exercises().find(e => e.id === id);
  }

  // ── GIF з Firebase ──
  gifPath(id: string): string {
    const ex = this.getExercise(id);
    if (ex?.gifUrl) return ex.gifUrl;
    return `https://storage.googleapis.com/fitnessapp-48877.firebasestorage.app/gif/exercise_${id}.gif`;
  }

  calcPR(ex: IExercise | undefined): number | null {
    return  null;
  }

  pctOfPR(sets: ISetPlan[], pr: number | null): number {
    if (!pr || !sets.length) return 0;
    const maxWeight = Math.max(...sets.map(s => s.weight));
    return Math.round((maxWeight / pr) * 100);
  }

  pctColor(pct: number): string {
    if (pct >= 80) return '#ef5350';
    if (pct >= 75) return '#d4a574';
    if (pct >= 70) return '#9ccc65';
    if (pct >= 65) return '#4db6ac';
    return '#26c6da';
  }

  tonnage(plan: IExercisePlan): number {
    return plan.sets.reduce((sum, s) => sum + s.weight * s.reps, 0);
  }

  dayTonnage(dayId: string): number {
    const day = this.currentWeekDays().find(d => d.id === dayId);
    return day?.exercises.reduce((sum, ex) => sum + this.tonnage(ex), 0) ?? 0;
  }

  // ── Picker ──
  openPicker(dayId: string) {
    this.addingToDayId.set(dayId);
    //this.showPicker.set(true);
    this.router.navigate(['programs','add']).then((a)=>console.log('ddd',a))
  }

  onExerciseSelected(ex: IExercise) {
    const dayId = this.addingToDayId();
    if (!dayId) return;
    this.program.update(prog => ({
      ...prog,
      weeks: prog.weeks.map((w, wi) => wi !== this.activeWeek() ? w : {
        ...w,
        days: w.days.map(d => d.id !== dayId ? d : {
          ...d,
          exercises: [...d.exercises, {exerciseId: ex.id, sets: [{weight: 0, reps: 0}]}]
        })
      })
    }));
    this.showPicker.set(false);
    this.addingToDayId.set(null);
  }

  // ── Sets ──
  updateSet(dayId: string, exId: string, setIdx: number, field: 'weight' | 'reps', value: number) {
    this.program.update(prog => ({
      ...prog,
      weeks: prog.weeks.map((w, wi) => wi !== this.activeWeek() ? w : {
        ...w,
        days: w.days.map(d => d.id !== dayId ? d : {
          ...d,
          exercises: d.exercises.map(ex => ex.exerciseId !== exId ? ex : {
            ...ex,
            sets: ex.sets.map((s, si) => si !== setIdx ? s : {...s, [field]: +value || 0})
          })
        })
      })
    }));
  }

  addSet(dayId: string, exId: string) {
    this.program.update(prog => ({
      ...prog,
      weeks: prog.weeks.map((w, wi) => wi !== this.activeWeek() ? w : {
        ...w,
        days: w.days.map(d => d.id !== dayId ? d : {
          ...d,
          exercises: d.exercises.map(ex => ex.exerciseId !== exId ? ex : {
            ...ex,
            sets: [...ex.sets, {...(ex.sets[ex.sets.length - 1] ?? {weight: 0, reps: 0})}]
          })
        })
      })
    }));
  }

  removeSet(dayId: string, exId: string, setIdx: number) {
    this.program.update(prog => ({
      ...prog,
      weeks: prog.weeks.map((w, wi) => wi !== this.activeWeek() ? w : {
        ...w,
        days: w.days.map(d => d.id !== dayId ? d : {
          ...d,
          exercises: d.exercises.map(ex => ex.exerciseId !== exId ? ex : {
            ...ex,
            sets: ex.sets.filter((_, si) => si !== setIdx)
          })
        })
      })
    }));
  }

  removeExercise(dayId: string, exId: string) {
    this.program.update(prog => ({
      ...prog,
      weeks: prog.weeks.map((w, wi) => wi !== this.activeWeek() ? w : {
        ...w,
        days: w.days.map(d => d.id !== dayId ? d : {
          ...d,
          exercises: d.exercises.filter(ex => ex.exerciseId !== exId)
        })
      })
    }));
  }

  // ── Days ──
  addDay() {
    this.program.update(prog => ({
      ...prog,
      weeks: prog.weeks.map((w, wi) => {
        if (wi !== this.activeWeek()) return w;
        const dayNum = w.days.length + 1;
        return {
          ...w,
          days: [...w.days, {
            id: `day-${wi + 1}-${dayNum}-${Date.now()}`,
            name: `Day ${dayNum}`,
            exercises: []
          }]
        };
      })
    }));
  }

  removeDay(dayId: string) {
    this.program.update(prog => ({
      ...prog,
      weeks: prog.weeks.map((w, wi) => wi !== this.activeWeek() ? w : {
        ...w,
        days: w.days.filter(d => d.id !== dayId)
      })
    }));
  }

  startRenameDay(day: IWorkoutDay) {
    this.editingDayId.set(day.id);
    this.renameDayName.set(day.name);
  }

  confirmRenameDay(dayId: string) {
    const name = this.renameDayName().trim();
    if (!name) return;
    this.program.update(prog => ({
      ...prog,
      weeks: prog.weeks.map((w, wi) => wi !== this.activeWeek() ? w : {
        ...w,
        days: w.days.map(d => d.id !== dayId ? d : {...d, name})
      })
    }));
    this.editingDayId.set(null);
  }

  toggleCopyMenu(dayId: string) {
    this.showCopyMenu.set(this.showCopyMenu() === dayId ? null : dayId);
  }

  copyDayToWeek(dayId: string, targetWeekIdx: number) {
    const sourceDay = this.currentWeekDays().find(d => d.id === dayId);
    if (!sourceDay) return;
    this.program.update(prog => ({
      ...prog,
      weeks: prog.weeks.map((w, wi) => wi !== targetWeekIdx ? w : {
        ...w,
        days: [...w.days, {
          ...sourceDay,
          id: `day-${targetWeekIdx + 1}-${w.days.length + 1}-${Date.now()}`
        }]
      })
    }));
  }

  // ── Drag & Drop ──
  dropExercise(event: CdkDragDrop<any[]>, dayId: string) {
    this.program.update(prog => ({
      ...prog,
      weeks: prog.weeks.map((w, wi) => wi !== this.activeWeek() ? w : {
        ...w,
        days: w.days.map(d => {
          if (d.id !== dayId) return d;
          const exercises = [...d.exercises];
          moveItemInArray(exercises, event.previousIndex, event.currentIndex);
          return {...d, exercises};
        })
      })
    }));
  }

  dropDay(event: CdkDragDrop<any[]>) {
    this.program.update(prog => ({
      ...prog,
      weeks: prog.weeks.map((w, wi) => {
        if (wi !== this.activeWeek()) return w;
        const days = [...w.days];
        moveItemInArray(days, event.previousIndex, event.currentIndex);
        return {...w, days};
      })
    }));
  }

  protected onBack() {
    this.location.back();
  }

  protected onMain() {
    this.router.navigate(['dashboard']);
  }
}
