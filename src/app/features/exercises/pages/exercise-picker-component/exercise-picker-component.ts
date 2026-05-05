import {Component, computed, inject, input, OnInit, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ExerciseStore} from '../../../../core/store/exercise.store';
import {IExercise} from '../../../../core/model/Exercise-model';
import {collection, Firestore, getDocs} from '@angular/fire/firestore';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {BodyPartStore, IBodyPart} from '../../../../core/store/Body.part.store';


@Component({
  selector: 'app-exercise-picker',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './exercise-picker-component.html',
  styleUrl: './exercise-picker-component.scss'
})
export class ExercisePickerComponent implements OnInit{
  selected = output<IExercise>();
  cancelled = output<void>();
  muscleGroup = input.required<IBodyPart>();
  bodyPartStore = inject(BodyPartStore);


  ngOnInit(): void {
    // завантажити список груп (викличеться тільки якщо порожньо)
    const x= this.bodyPartStore.loadAll()

  }



  onMuscleGroupClick(params: string): void {

    this.router.navigate(['/exercises', params]);
  }

  private firestore = inject(Firestore);
  protected store = inject(ExerciseStore);
  location=inject(Location)
  router=inject(Router)

  search = signal('');
  activeFilter = signal('all');
  selectedEx = signal<IExercise | null>(null);

  bodyParts = signal<string[]>(['all']);

  constructor() {
    this.loadBodyParts();
  }

  private async loadBodyParts() {
    const snap = await getDocs(collection(this.firestore, 'bodyParts'));
    const parts = snap.docs.map(d => d.id);
    this.bodyParts.set(['all', ...parts]);
  }

  filtered = computed(() => {
    const s = this.search().toLowerCase();
    const f = this.activeFilter();
    return this.store.exercises().filter(ex =>
      (f === 'all' || ex.bodyPart === f) &&
      (ex.name?.toLowerCase().includes(s) ?? false)
    );
  });

  onFilterChange(part: string) {
    this.activeFilter.set(part);
    this.selectedEx.set(null);
    if (part !== 'all') {
      this.store.loadByBodyPart(part);
    }
  }

  onScroll(event: Event) {
    const el = event.target as HTMLElement;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    if (nearBottom) {
      this.store.loadMore();
    }
  }

  select(ex: IExercise) {
    this.selectedEx.set(this.selectedEx()?.id === ex.id ? null : ex);
  }

  confirm() {
    const ex = this.selectedEx();
    if (ex) this.selected.emit(ex);
  }

  protected onBack() {
      this.location.back();

  }
}
