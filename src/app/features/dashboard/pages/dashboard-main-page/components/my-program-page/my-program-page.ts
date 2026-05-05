import {Component, inject, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-my-program-page',
  imports: [],
  templateUrl: './my-program-page.html',
  standalone: true,
  styleUrl: './my-program-page.scss'
})
export class MyProgramPage {
 @Input() numb: number=0
  router=inject(Router)

  protected onRouter() {
    this.router.navigate(['program'])
  }
}
