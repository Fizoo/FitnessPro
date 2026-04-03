import {Component, input} from '@angular/core';

@Component({
    selector: 'app-spinner',
    imports: [],
    templateUrl: './spinner.html',
    standalone: true,
    styleUrl: './spinner.scss'
})
export class Spinner {
  message = input<string>('')
}
