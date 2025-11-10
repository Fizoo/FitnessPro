import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {rxResource, toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {ExerciseService} from '../../../core/services/exercise-service';
import {IExercise} from '../../../core/model/Exercise-model';


interface Exercise {
  id: string;
  name: string;
  gifUrl: string;
  bodyPart: string;
  equipment: string;
  target: string;
  description?: string;
  instructions?: string[];
}
interface Video {
  id: string;
  title: string;
  url: string;
  duration?: string;
}

@Component({
  selector: 'app-exercise-detail-page',
  imports: [],
  templateUrl: './exercise-detail-page.html',
  styleUrl: './exercise-detail-page.scss'
})
export class ExerciseDetailPage implements OnInit{
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private exerciseService=inject(ExerciseService)

  readonly userParams = toSignal(
    this.route.paramMap.pipe(
      map(params => ({
        exerciseId: params.get('exerciseId') ?? '',
        muscleGroup: params.get('muscleGroup') ?? ''
      }))
    ),
    { initialValue: { exerciseId: '', muscleGroup: '' } }
  );

  exercise = signal<Exercise | null>(null);
  exerciseVideos = signal<Video[]>([]);


  readonly exercisesRx = rxResource<IExercise, { exerciseId: string; muscleGroup: string }>({
    params: () => this.userParams(),
    defaultValue: {} as IExercise,
    stream: ({ params }) =>
      this.exerciseService.getExercisesByBodyPart(params.muscleGroup).pipe(
        map(exercises => {
          const exercise = exercises.find(e => e.id === params.exerciseId);
          //if (!exercise) return {} as IExercise;
          return exercise || {} as IExercise;

        /*  return {
          ...exercise,
              gifUrl: this.exerciseService.getExerciseImageUrl(params.exerciseId, '180')
          };*/
        }),
      )
  });



  ngOnInit(): void {
 /*   this.route.params.subscribe(params => {
      console.log(params)
      const exerciseId = params['exerciseId'];
      const muscleGroup = params['muscleGroup'];
      this.loadExercise(exerciseId);
      this.loadVideos(exerciseId);
    });*/
  }

  loadExercise(exerciseId: string): void {

  }

  loadVideos(exerciseId: string): void {
    // TODO: Завантаж відео з бази даних
    // URL може бути YouTube embed URL або пряме посилання на відео
    this.exerciseVideos.set([
      {
        id: '1',
        title: 'Proper Form and Technique',
        url: 'https://www.youtube.com/embed/VIDEO_ID_1',
        duration: '5:32'
      },
      {
        id: '2',
        title: 'Common Mistakes to Avoid',
        url: 'https://www.youtube.com/embed/VIDEO_ID_2',
        duration: '3:45'
      }
    ]);
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  goBack(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
