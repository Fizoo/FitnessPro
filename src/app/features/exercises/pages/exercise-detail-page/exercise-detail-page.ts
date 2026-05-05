import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {ExerciseStore} from '../../../../core/store/exercise.store';


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
  standalone: true,
  styleUrl: './exercise-detail-page.scss'
})
export class ExerciseDetailPage implements OnInit{
  store    = inject(ExerciseStore);
  route    = inject(ActivatedRoute);
  router    = inject(Router);
  sanitizer=inject(DomSanitizer)
  exercise = this.store.selectedExercise;

  ngOnInit() {
    const muscleGroup = this.route.snapshot.paramMap.get('muscleGroup')!;
    const exerciseId  = this.route.snapshot.paramMap.get('exerciseId')!;
    this.store.loadById(muscleGroup, exerciseId);
  }

  readonly params = toSignal(
    this.route.paramMap.pipe(
      map(p => ({
        exerciseId:  p.get('exerciseId') ?? '',
        muscleGroup: p.get('muscleGroup') ?? ''
      }))
    ),
    { initialValue: { exerciseId: '', muscleGroup: '' } }
  );

  constructor() {
    effect(() => {
      const { exerciseId, muscleGroup } = this.params();
      if (exerciseId && muscleGroup) {
        this.store.loadById(muscleGroup, exerciseId);
      }
    });
  }



  exerciseVideos = signal<Video[]>([]);
  //exerciseImg=signal()


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


  protected onClick(list: any) {
  }
}
