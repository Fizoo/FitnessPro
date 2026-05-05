import { Component, signal } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-new-workout',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule],
  templateUrl: 'new-workout-component.html',
  styleUrl: 'new-workout-component.scss',
})
export class NewWorkoutComponent {
  title = signal<string>('');

  constructor(private location: Location, private router: Router) {}

  goBack(): void {
    this.location.back();
  }

  onCreate(): void {
    if (!this.title().trim()) return;
    // TODO: створити день в Firebase через signals store
    console.log('Create:', this.title());
    this.router.navigate(['/exercises']);
  }
}
