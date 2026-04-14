import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';

import {toObservable} from '@angular/core/rxjs-interop';
import {filter, map, take} from 'rxjs';
import {AuthStore} from '../store/auth.store';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthStore);
  return toObservable(auth.isInitialized).pipe(
    filter(Boolean),
    take(1),
    map(() => auth.isLoggedIn() ? true : inject(Router).createUrlTree(['/login']))
  );
};
