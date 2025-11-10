import {Component, inject, resource} from '@angular/core';
import {Router} from '@angular/router';
import {MuscleCard} from '../muscle-card/muscle-card';
import {ExerciseService} from '../../../../../core/services/exercise-service';
import {firstValueFrom} from 'rxjs';
import {Spinner} from '../../../../../shared/components/spinner/spinner';
import {Alert} from '../../../../../shared/components/alert/alert';


@Component({
  selector: 'app-muscle-groups-list',
  imports: [
    MuscleCard,
    Spinner,
    Alert
  ],
  templateUrl: './muscle-groups-list.html',
  styleUrl: './muscle-groups-list.scss'
})
export class MuscleGroupsList {

  exercisesService=inject(ExerciseService)
  router = inject(Router);

  onMuscleGroupsResource=resource({
    loader: ()=>firstValueFrom( this.exercisesService.getBodyPartList())
  })


  onMuscleGroupClick(bodyPart: string): void {

    this.router.navigate(['/exercises', bodyPart]);
  }
}
