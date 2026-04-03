import {Component, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MuscleCard} from '../muscle-card/muscle-card';
import {exercisesData} from '../../../../../../../public/data/data';


@Component({
  selector: 'app-muscle-groups-list',
  imports: [
    MuscleCard
  ],
  templateUrl: './muscle-groups-list.html',
  standalone: true,
  styleUrl: './muscle-groups-list.scss'
})
export class MuscleGroupsList {

  router = inject(Router);

  data=signal(exercisesData)

  onMuscleGroupClick(bodyPart: string): void {
    this.router.navigate(['/exercises', bodyPart]);
  }
}
