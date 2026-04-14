import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HeaderExercise} from '../../components/header-exercise/header-exercise';

@Component({
  selector: 'app-exercises-page',
  imports: [
    FormsModule,
    HeaderExercise,
    RouterOutlet
  ],
  templateUrl: './exercises-page.html',
  standalone: true,
  styleUrl: './exercises-page.scss'
})
export class ExercisesPage {
  searchQuery = signal('');
  selectedCount = signal(1);



  onSearch(): void {
    // Автоматично оновлюється через computed signal
  }



}
