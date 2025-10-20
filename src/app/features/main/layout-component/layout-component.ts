import { Component } from '@angular/core';
import {Header} from '../header/header';
import {MainPage} from '../main-page/main-page';

@Component({
  selector: 'app-layout-component',
  imports: [
    Header,
    MainPage
  ],
  templateUrl: './layout-component.html',
  styleUrl: './layout-component.scss'
})
export class LayoutComponent {

}
