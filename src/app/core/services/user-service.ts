import { inject, Injectable, computed } from '@angular/core';
import {AuthService} from './auth-service';


@Injectable({ providedIn: 'root' })
export class UserService {
  private auth = inject(AuthService);

  // ── Основні дані ──
  readonly user = this.auth.currentUser;
  readonly isLoggedIn = computed(() => !!this.auth.currentUser());
  readonly isLoading = computed(() => !this.auth.isInitialized());

  // ── Профіль ──
  readonly uid = computed(() => this.auth.currentUser()?.uid ?? null);
  readonly displayName = computed(() => this.auth.currentUser()?.displayName ?? '');
  readonly email = computed(() => this.auth.currentUser()?.email ?? '');
  readonly photoURL = computed(() => this.auth.currentUser()?.photoURL ?? null);
  readonly initials = computed(() => {
    const name = this.auth.currentUser()?.displayName;
    return name ? name.charAt(0).toUpperCase() : '?';
  });

  // ── Фізичні дані ──
  readonly age = computed(() => this.auth.currentUser()?.age ?? null);
  readonly gender = computed(() => this.auth.currentUser()?.gender ?? null);
  readonly height = computed(() => this.auth.currentUser()?.height ?? null);
  readonly weight = computed(() => this.auth.currentUser()?.weight ?? null);
  readonly fitnessGoal = computed(() => this.auth.currentUser()?.fitnessGoal ?? null);

  // ── Налаштування ──
  readonly settings = computed(() => this.auth.currentUser()?.settings ?? null);
  readonly theme = computed(() => this.auth.currentUser()?.settings?.theme ?? 'dark');
  readonly language = computed(() => this.auth.currentUser()?.settings?.language ?? 'uk');
  readonly weightUnit = computed(() => this.auth.currentUser()?.settings?.weightUnit ?? 'kg');


}
