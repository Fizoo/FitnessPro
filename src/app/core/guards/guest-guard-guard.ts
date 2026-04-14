// guest.guard.ts — щоб залогінений не міг зайти на /login
import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';

import {toObservable} from '@angular/core/rxjs-interop';
import {filter, map, take} from 'rxjs';
import {AuthStore} from '../store/auth.store';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthStore);
  const router = inject(Router);

  return toObservable(auth.isInitialized).pipe(
    filter(Boolean),
    take(1),
    map(() => auth.isLoggedIn() ? router.createUrlTree(['/dashboard']) : true)
  );
};
