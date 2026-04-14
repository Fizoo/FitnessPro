import {Component, computed, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {exercisesData} from '../../../../../../public/data/data';

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
export class ExerciseDetailPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);


  readonly userParams = toSignal(
    this.route.paramMap.pipe(
      map(params => ({
        exerciseId: params.get('exerciseId') ?? '',
        muscleGroup: params.get('muscleGroup') ?? ''
      }))
    ),
    { initialValue: { exerciseId: '', muscleGroup: '' } }
  );

  list = computed(() => {
    const { exerciseId, muscleGroup } = this.userParams();
    const group = exercisesData.find(g => g.params === muscleGroup);
    const exercise = group?.data.find(e => e.id === exerciseId) ?? null;
    console.log('muscleGroup:', muscleGroup, 'exerciseId:', exerciseId, 'exercise:', exercise);
    return exercise;
  });

  //exercise = signal<Exercise | null>(null);
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
