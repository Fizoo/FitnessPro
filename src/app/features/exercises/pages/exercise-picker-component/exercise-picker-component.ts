import { Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-exercise-picker',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './exercise-picker-component.html',
  styleUrl: './exercise-picker-component.scss'
})
export class ExercisePickerComponent {
  exercises = input.required<any[]>();
  selected = output<any>();
  cancelled = output<void>();

  search = signal('');
  activeFilter = signal('all');
  selectedEx = signal<any | null>(null);

  readonly bodyParts = ['all', 'chest', 'back', 'upper arms', 'shoulders', 'upper legs', 'waist'];

  filtered = computed(() => {
    const s = this.search().toLowerCase();
    const f = this.activeFilter();
    return this.exercises().filter(ex =>
      (f === 'all' || ex.bodyPart === f) &&
      (ex.name?.toLowerCase().includes(s) ?? false)
    );
  });

  gifPath(id: string): string {
    return `assets/gifs/exercise_${id}.gif`;
  }

  select(ex: any) {
    this.selectedEx.set(this.selectedEx()?.id === ex.id ? null : ex);
  }

  confirm() {
    const ex = this.selectedEx();
    if (ex) this.selected.emit(ex);
  }
}
