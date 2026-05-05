import {Component, computed, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MuscleCard} from '../../components/muscle-card/muscle-card';


import {BodyPartStore} from '../../../../core/store/Body.part.store';
import {ExerciseStore} from '../../../../core/store/exercise.store';


@Component({
  selector: 'app-muscle-groups-list',
  imports: [
    MuscleCard
  ],
  templateUrl: './muscle-groups-list.html',
  standalone: true,
  styleUrl: './muscle-groups-list.scss'
})
export class MuscleGroupsList implements OnInit{
  bodyPartStore = inject(BodyPartStore);
  exerciseStore = inject(ExerciseStore);
  router        = inject(Router);

  // фільтруємо групи по searchQuery
  filteredGroups = computed(() => {
    const q = this.exerciseStore.searchQuery().toLowerCase().trim();
    if (!q) return this.bodyPartStore.bodyParts();
    return this.bodyPartStore.bodyParts().filter(g =>
      g.name.toLowerCase().includes(q)
    );
  });



  ngOnInit() {
    this.bodyPartStore.loadAll();
    this.exerciseStore.setSearch(''); // ← додай це
  }

  onMuscleGroupClick(params: string): void {
    this.router.navigate(['/exercises', params]);
  }
}
