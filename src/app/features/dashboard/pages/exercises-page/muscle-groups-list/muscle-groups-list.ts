import {Component, computed, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MuscleCard, MuscleGroup} from '../muscle-card/muscle-card';

@Component({
  selector: 'app-muscle-groups-list',
  imports: [
    MuscleCard
  ],
  templateUrl: './muscle-groups-list.html',
  styleUrl: './muscle-groups-list.scss'
})
export class MuscleGroupsList {
  private router = inject(Router);

  muscleGroups = signal<MuscleGroup[]>([]);

  filteredMuscleGroups = computed(() => this.muscleGroups());

  ngOnInit(): void {
    this.loadMuscleGroups();
  }

  loadMuscleGroups(): void {
    this.muscleGroups.set([
      { id: 1, name: 'Chest', image: 'assets/img/Chest.png', exerciseCount: 15 },
      { id: 2, name: 'Back', image: 'assets/img/Chest.png', exerciseCount: 20 },
      { id: 3, name: 'Legs', image: 'assets/img/Chest.png', exerciseCount: 18 },
      { id: 4, name: 'Gluteus', image: 'assets/img/Chest.png', exerciseCount: 12 },
      { id: 5, name: 'Shoulders', image: 'assets/img/Chest.png', exerciseCount: 14 },
      { id: 6, name: 'Arms', image: 'assets/img/Chest.png', exerciseCount: 16 },
    ]);
  }

  onMuscleGroupClick(group: MuscleGroup): void {
    this.router.navigate(['/exercises', group.name]);
   // this.router.navigate(['/exercises', group.id]);
  }
}
