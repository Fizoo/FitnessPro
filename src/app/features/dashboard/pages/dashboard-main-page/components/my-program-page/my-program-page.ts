import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-my-program-page',
  imports: [],
  templateUrl: './my-program-page.html',
  standalone: true,
  styleUrl: './my-program-page.scss'
})
export class MyProgramPage {
 @Input() numb: number=0

}
