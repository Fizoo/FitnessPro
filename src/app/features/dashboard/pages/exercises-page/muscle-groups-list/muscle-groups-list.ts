import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MuscleCard} from '../muscle-card/muscle-card';
import {ExerciseService} from '../../../../../core/services/exercise-service';
import {IMuscleGroup} from '../../../../../core/model/Exercise-model';
import {map} from 'rxjs';

@Component({
  selector: 'app-muscle-groups-list',
  imports: [
    MuscleCard
  ],
  templateUrl: './muscle-groups-list.html',
  styleUrl: './muscle-groups-list.scss'
})
export class MuscleGroupsList implements OnInit{
  exercisesService=inject(ExerciseService)
  private router = inject(Router);

  isLoading = signal(false);
  muscleList=signal<string[]>([])
  muscleGroups = signal<IMuscleGroup[]>([]);


  filteredMuscleGroups = computed(() => this.muscleGroups());

  ngOnInit(): void {
    this.loadMuscleGroups();

  }

  loadMuscleGroups(): void {
    this.isLoading.set(true);
    console.log('errr')

    this.exercisesService.getBodyPartList().pipe(
      map(res=>res.map(el=>({
        id:el,
        name:el,
        imageUrl:'assets/img/Chest.png',
        exerciseCount:0
      })))
    ).subscribe(data=>{
        this.muscleGroups.set(data)

    })

   /* this.muscleGroups.set([
      { id: 1, name: 'Chest', image: 'assets/img/Chest.png', exerciseCount: 15 },
      { id: 2, name: 'Back', image: 'assets/img/Chest.png', exerciseCount: 20 },
      { id: 3, name: 'Legs', image: 'assets/img/Chest.png', exerciseCount: 18 },
      { id: 4, name: 'Gluteus', image: 'assets/img/Chest.png', exerciseCount: 12 },
      { id: 5, name: 'Shoulders', image: 'assets/img/Chest.png', exerciseCount: 14 },
      { id: 6, name: 'Arms', image: 'assets/img/Chest.png', exerciseCount: 16 },
    ]);*/
  }

  onMuscleGroupClick(group: IMuscleGroup): void {
    this.router.navigate(['/exercises', group.name]);
   // this.router.navigate(['/exercises', group.id]);
  }
}
