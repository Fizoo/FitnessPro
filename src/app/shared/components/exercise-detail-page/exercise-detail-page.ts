import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';


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

  exercise = signal<Exercise | null>(null);
  exerciseVideos = signal<Video[]>([]);

  exerciseDescription = computed(() => {
    const ex = this.exercise();
    if (!ex) return '';

    return ex.description || `The ${ex.name} is considered as the best basic exercise for developing the ${ex.target} muscles and increasing general strength. This exercise allows a greater amplitude of movement than the classic bar press, and allows you to work out the muscles more efficiently. In addition, stabilizing muscles are more involved here. Using this type of inclination makes it possible to minimize the work of the triceps and deltoids.`;
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const exerciseId = params['exerciseId'];
      this.loadExercise(exerciseId);
      this.loadVideos(exerciseId);
    });
  }

  loadExercise(exerciseId: string): void {
    // TODO: Завантаж з API
    this.exercise.set({
      id: exerciseId,
      name: '30-degree incline dumbbell bench press',
      gifUrl: 'assets/img/bench-mini.jpg',
      bodyPart: 'Chest',
      equipment: 'dumbbell',
      target: 'pectorals',
      description: 'The inclined dumbbell bench press is considered as the best basic exercise for developing the pectoral muscles and increasing general strength. This exercise allows a greater amplitude of movement than the classic bar press, and allows you to work out the muscles more efficiently. In addition, stabilizing muscles are more involved here. Using this type of inclination makes it possible to minimize the work of the triceps and deltoids.',
      instructions: [
        'Lie on an incline bench set at 30 degrees with a dumbbell in each hand',
        'Position the dumbbells at shoulder level with palms facing forward',
        'Press the dumbbells up until your arms are fully extended',
        'Lower the dumbbells slowly back to the starting position',
        'Repeat for the desired number of repetitions'
      ]
    });
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
