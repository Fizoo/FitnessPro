import {
  Directive,
  ElementRef,
  Output,
  EventEmitter,
  OnDestroy,
  inject,
  effect,
  input
} from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true
})
export class InfiniteScrollDirective implements OnDestroy {
  private el = inject(ElementRef<HTMLElement>);

  // чи можна вантажити ще
  canLoad = input<boolean>(true);

  // чи зараз йде загрузка
  loading = input<boolean>(false);

  // подія назовні
  @Output() loadMore = new EventEmitter<void>();

  private observer?: IntersectionObserver;

  constructor() {
    effect(() => {
      const element = this.el.nativeElement;

      this.observer?.disconnect();

      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (
            entry.isIntersecting &&
            this.canLoad() &&
            !this.loading()
          ) {
            // мікротаска — щоб уникнути дергання
            queueMicrotask(() => this.loadMore.emit());
          }
        },
        {
          root: null,
          rootMargin: '200px', // 🔥 preload
          threshold: 0.1
        }
      );

      this.observer.observe(element);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
