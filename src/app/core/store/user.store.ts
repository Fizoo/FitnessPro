import { inject } from '@angular/core';
import { signalStore, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';
import { AuthStore } from './auth.store';

export const UserStore = signalStore(
  { providedIn: 'root' },
  withComputed(() => {
    const auth = inject(AuthStore);
    return {
      user: computed(() => auth.currentUser()),
      isLoggedIn: computed(() => auth.isLoggedIn()),
      isLoading: computed(() => !auth.isInitialized()),
      uid: computed(() => auth.uid()),
      displayName: computed(() => auth.displayName()),
      email: computed(() => auth.email()),
      photoURL: computed(() => auth.photoURL()),
      initials: computed(() => auth.initials()),
      age: computed(() => auth.currentUser()?.age ?? null),
      gender: computed(() => auth.currentUser()?.gender ?? null),
      height: computed(() => auth.currentUser()?.height ?? null),
      weight: computed(() => auth.currentUser()?.weight ?? null),
      fitnessGoal: computed(() => auth.currentUser()?.fitnessGoal ?? null),
      settings: computed(() => auth.currentUser()?.settings ?? null),
      theme: computed(() => auth.currentUser()?.settings?.theme ?? 'dark'),
      language: computed(() => auth.currentUser()?.settings?.language ?? 'uk'),
      weightUnit: computed(() => auth.currentUser()?.settings?.weightUnit ?? 'kg'),
    };
  })
);
