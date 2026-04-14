import {Component, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';
import {MatDivider} from '@angular/material/list';
import {UserService} from '../../../core/services/user-service';
import {AuthStore} from '../../../core/store/auth.store';

@Component({
  selector: 'app-user-avatar-component',
  imports: [
    MatMenu,
    MatIcon,
    MatDivider,
    MatMenuTrigger,
    MatMenuItem
  ],
  templateUrl: './user-avatar-component.html',
  styleUrl: './user-avatar-component.scss',
})
export class UserAvatarComponent {
  protected auth = inject(AuthStore);
  private router = inject(Router);

  hasImgError = signal(false);
  protected userService = inject(UserService);

  onImgError(e: Event): void {
    (e.target as HTMLImageElement).style.display = 'none';
    this.hasImgError.set(true);
  }

  goSettings(): void { this.router.navigate(['profile']); }
  goChangeUser(): void { this.router.navigate(['/login']); }
  goLogin(): void { this.router.navigate(['/login']); }

  async onLogout(): Promise<void> {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }

}
