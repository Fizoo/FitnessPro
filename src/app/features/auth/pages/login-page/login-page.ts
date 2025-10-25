import {Component, inject, signal} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {faFacebook, faGithub, faGoogle} from '@fortawesome/free-brands-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faEnvelope, faLock, faUser} from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-login-page',
  imports: [
    MatIcon,
    FaIconComponent,
    ReactiveFormsModule
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  fb=inject(FormBuilder)

  hide = signal<boolean >(true);
  isActiveClass = signal<boolean>(false);


  faGoogle = faGoogle;
  faFacebook = faFacebook;
  faGithub = faGithub;
  faUser = faUser;
  faLock = faLock;
  faEnvelope = faEnvelope;


  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(6)
    ]]
  });



  onRegister() {
    console.log(this.registerForm.value)
  }

  onLogin() {

    console.log(this.loginForm.value)
  }

  showRegister() {
    this.isActiveClass.set(true)
  }

  showLogin() {
    this.isActiveClass.set(false)
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get username2() {
    return this.registerForm.get('username');
  }

  get password2() {
    return this.registerForm.get('password');
  }

  get email() {
    return this.registerForm.controls['email']
  }
}
