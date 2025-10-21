import {Component, signal} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {faFacebook, faGithub, faGoogle} from '@fortawesome/free-brands-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faEnvelope, faLock, faUser} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login-page',
  imports: [
    MatIcon,
    FaIconComponent
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  hide = signal<boolean >(true);
  isActiveClass = signal<boolean>(false);


  faGoogle = faGoogle;
  faFacebook = faFacebook;
  faGithub = faGithub;
  faUser = faUser;
  faLock = faLock;
  faEnvelope = faEnvelope;

  showLogin() {
    this.isActiveClass.set(false)
  }

  showRegister() {
    this.isActiveClass.set(true)
  }
}
