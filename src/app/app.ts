import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToastComponent} from './shared/components/toast-component/toast-component';
import {AuthStore} from './core/store/auth.store';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToastComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Fitness');
  private authStore = inject(AuthStore);

  constructor() {
    this.authStore.init();
  }

}
