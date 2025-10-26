import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HeaderExercise} from './header-exercise/header-exercise';

@Component({
  selector: 'app-exercises-page',
  imports: [
    FormsModule,
    HeaderExercise,
    RouterOutlet
  ],
  templateUrl: './exercises-page.html',
  styleUrl: './exercises-page.scss'
})
export class ExercisesPage {
  searchQuery = signal('');
  selectedCount = signal(1);



  onSearch(): void {
    // Автоматично оновлюється через computed signal
  }



}
