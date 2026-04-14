import {Component, inject, signal} from '@angular/core';
import {faFacebook, faGithub, faGoogle} from '@fortawesome/free-brands-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faEnvelope, faLock, faUser} from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

import {Router} from '@angular/router';
import {AuthStore} from '../../../../core/store/auth.store';


@Component({
  selector: 'app-login-page',
  imports: [FaIconComponent, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  private fb = inject(FormBuilder);
  protected auth = inject(AuthStore);
  private router = inject(Router);

  isActiveClass = signal(false);

  faGoogle = faGoogle;
  faFacebook = faFacebook;
  faGithub = faGithub;
  faUser = faUser;
  faLock = faLock;
  faEnvelope = faEnvelope;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onLogin(): Promise<void> {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    await this.auth.login(email!, password!);
    if (this.auth.status() === 'success') {
      this.router.navigate(['/dashboard']);
    }
  }

  async onRegister(): Promise<void> {
    if (this.registerForm.invalid) return;
    const { email, password, username } = this.registerForm.value;
    await this.auth.register(email!, password!, username!);
    if (this.auth.status() === 'success') {
      this.router.navigate(['/dashboard']);
    }
  }

  async onGoogle(): Promise<void> {
    await this.auth.loginWithGoogle();
    if (!this.auth.error()) this.router.navigate(['/dashboard']);

  }

  async onFacebook(): Promise<void> {
    await this.auth.loginWithFacebook();
    if (!this.auth.error()) this.router.navigate(['/dashboard']);
  }

  async onGitHub(): Promise<void> {

   /* await this.auth.loginWithGitHub();
    if (!this.auth.error()) this.router.navigate(['/dashboard']);*/
  }

  async onLogout(): Promise<void> {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }

  showRegister(): void {
    this.isActiveClass.set(true);
  }

  showLogin(): void {
    this.isActiveClass.set(false);
  }

  // Login form getters
  get loginEmail() {
    return this.loginForm.get('email');
  }

  get loginPassword() {
    return this.loginForm.get('password');
  }

  // Register form getters
  get regUsername() {
    return this.registerForm.get('username');
  }

  get regEmail() {
    return this.registerForm.get('email');
  }

  get regPassword() {
    return this.registerForm.get('password');
  }
}
