import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header-exercise',
  imports: [CommonModule],
  templateUrl: './header-exercise.html',
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

  private router = inject(Router);


  onBack(): void {
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
