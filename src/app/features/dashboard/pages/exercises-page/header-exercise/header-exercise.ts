import {Component, EventEmitter, inject, Input, Output} from '@angular/core';

import {Router} from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-header-exercise',
    imports: [],
    templateUrl: './header-exercise.html',
    standalone: true,
    styleUrl: './header-exercise.scss'
})
export class HeaderExercise {


  @Input({ required: true }) title: string = '';
  @Input() showBookmark: boolean = false;
  @Input() showFilter: boolean = false;
  @Input() isBookmarked: boolean = false;

  @Output() back = new EventEmitter<void>();
  @Output() bookmark = new EventEmitter<void>();
  @Output() filter = new EventEmitter<void>();

  location=inject(Location)

  private router = inject(Router);


  onBack(): void {
    this.location.back();
  this.router.navigate(['exercises'])
    if (this.back.observed) {
      this.back.emit();
    } else {

    }
  }

  onBookmark(): void {
    this.bookmark.emit();
  }

  onFilter(): void {
    this.filter.emit();
  }
}
