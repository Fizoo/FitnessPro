import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthStore} from '../../../core/store/auth.store';

@Component({
  selector: 'app-main-page',
  imports: [],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss'
})
export class MainPage {
  router = inject(Router)

  private authStore = inject(AuthStore);

  constructor() {
    this.authStore.init(); // ← один раз при старті
  }

  openAPP() {
    this.router.navigate(['dashboard', 'main'])
  }
}
