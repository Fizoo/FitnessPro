import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';


@Component({
  selector: 'app-main-page',
  imports: [],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss'
})
export class MainPage {
  router = inject(Router)


  openAPP() {
    this.router.navigate(['dashboard', 'main'])
  }
}
