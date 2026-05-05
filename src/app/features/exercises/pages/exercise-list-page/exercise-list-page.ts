import {Component, inject, OnInit} from '@angular/core';
import {ExerciseCard} from '../../components/exercise-card/exercise-card';
import {ActivatedRoute, Router} from '@angular/router';
import {IExercise} from '../../../../core/model/Exercise-model';
import {ExerciseStore} from '../../../../core/store/exercise.store';
import {NotificationService} from '../../../../core/services/notification-service';
import {InfiniteScrollDirective} from '../../../../core/directives/infinite-scroll-directive';


@Component({
  selector: 'app-exercise-list-page',
  imports: [
    ExerciseCard,
    InfiniteScrollDirective
  ],
  templateUrl: './exercise-list-page.html',
  standalone: true,
  styleUrl: './exercise-list-page.scss'
})
export class ExerciseListPage implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notifications=inject(NotificationService)

  protected store=inject(ExerciseStore)


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const bodyPart = params.get('muscleGroup');
      if (!bodyPart) {
        console.error('muscleGroup is null');
        this.notifications.error('muscleGroup is null')
        return;
      }

      this.store.loadByBodyPart(bodyPart);
    });
  }

  onExerciseSelected(ex: IExercise) {
    //this.router.navigate([ex.id]);
    this.router.navigate([ex.id], { relativeTo: this.route });

  }
  onLoadMore() {
    this.store.loadMore().catch(er=>this.notifications.error('Помилка завантаження:',er))

  }


 /* private setupObserver(el: HTMLElement): void {
    this.observer?.disconnect();

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          this.store.hasMore() &&
          !this.store.isLoadingMore()
        ) {
          this.store.loadMore();
        }
      },
      {
        rootMargin: '200px', // 🔥 preload раніше
        threshold: 0.1
      }
    );

    this.observer.observe(el);
  }*/

}
