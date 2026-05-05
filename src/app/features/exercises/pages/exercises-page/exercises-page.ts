import {Component, inject} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HeaderExercise} from '../../components/header-exercise/header-exercise';
import {ExerciseStore} from '../../../../core/store/exercise.store';
import {toSignal} from '@angular/core/rxjs-interop';
import {filter, map, startWith} from 'rxjs';
import {Location} from '@angular/common';


@Component({
  selector: 'app-exercises-page',
  imports: [
    FormsModule,
    HeaderExercise,
    RouterOutlet,
  ],
  templateUrl: './exercises-page.html',
  standalone: true,
  styleUrl: './exercises-page.scss'
})
export class ExercisesPage {
  store  = inject(ExerciseStore);

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location=inject(Location)

  onBack(): void {
    this.router.navigate(['..'], { relativeTo: this.route.firstChild! });
  }

  isDetailPage = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.router.url.split('/').filter(Boolean).length >= 3)
    )
  );

}
