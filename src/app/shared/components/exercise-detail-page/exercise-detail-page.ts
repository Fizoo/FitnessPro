import {ChangeDetectorRef, Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {rxResource, toSignal} from '@angular/core/rxjs-interop';
import {firstValueFrom, map} from 'rxjs';
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
export class ExerciseDetailPage {

  private cdr=inject(ChangeDetectorRef)
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private exerciseService=inject(ExerciseService)

  imgSrc = signal<string | null>(null);


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
  //exerciseImg=signal()

  constructor() {
  }
 /* constructor() {
    effect(async () => {
      const ex = this.exercisesRx.value(); // rxResource value
      if (!ex || !ex.id) return;

      // скасовуємо попередній objectURL (опційно)
      const prev = this.imgSrc();
      if (prev) URL.revokeObjectURL(prev);

      try {
        const blob = await firstValueFrom(this.exerciseService.getExerciseImageBlob(String(ex.id), '180'));
        const url = URL.createObjectURL(blob);
        this.imgSrc.set(url);
        // якщо OnPush:
        this.cdr.markForCheck();
      } catch (e) {
        console.error('Image load failed', e);
        this.imgSrc.set(null);
        this.cdr.markForCheck();
      }
    });
  }*/


/*  readonly exercisesRx = rxResource<IExercise, { exerciseId: string; muscleGroup: string }>({
    params: () => this.userParams(),
    defaultValue: {} as IExercise,
    stream: ({ params }) =>
      this.exerciseService.getExercisesByBodyPart(params.muscleGroup).pipe(
        map(exercises => {
          const exercise = exercises.find(e => e.id === params.exerciseId);
          if (!exercise) return {} as IExercise;
         // return exercise || {} as IExercise;

          return {
          ...exercise,
              gifUrl: this.exerciseService.getExerciseImageUrl(params.exerciseId, '180')
            //  gifUrl: this.exerciseService.getExerciseImageUrl(params.exerciseId, '180')
          };
        }),
        tap(el=>console.log(el))
      )
  });*/

  /*readonly exercisesRx = rxResource<IExercise, { exerciseId: string; muscleGroup: string }>({
    params: () => this.userParams(),
    defaultValue: {} as IExercise,
    stream: ({ params }) =>
      this.exerciseService.getExercisesByBodyPart(params.muscleGroup).pipe(
        map(exercises => exercises.find(e => String(e.id) === String(params.exerciseId)) as IExercise | undefined),
        switchMap(ex => {
          if (!ex) return of({} as IExercise);
          // завантажуємо як blob і повертаємо objectURL, щоб <img [src]> точно оновився
          return this.exerciseService.getExerciseImageBlob(ex.id, '180').pipe(
            map(blob => ({
              ...ex,
              gifUrl: URL.createObjectURL(blob)
            }))
          );
        })
      )
  });*/
  readonly exercisesRx = rxResource<IExercise, { exerciseId: string; muscleGroup: string }>({
    params: () => this.userParams(),
    defaultValue: {} as IExercise,
    stream: ({ params }) =>
      this.exerciseService.getExercisesByBodyPart(params.muscleGroup).pipe(
        map(exercises => {
          const ex = exercises.find(e => String(e.id) === String(params.exerciseId));
          if (!ex) return {} as IExercise;

          console.log('exercisesRx =',ex)
          return  ex
        })
      )
  });



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

  async onClick(el:IExercise) {
    console.log(el)
    const blob = await firstValueFrom(this.exerciseService.getExerciseImageBlob(el.id, '180'));
    const url = URL.createObjectURL(blob);
    this.imgSrc.set(url); // тригерить оновлення
    this.cdr.markForCheck();

    /*  this.exerciseService.getExerciseImageBlob('0007','180').subscribe(data=>{
      console.log(data)
    })*/

  }
}
