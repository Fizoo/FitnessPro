import {HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

// Можеш винести ключі у сервіс або env, тут залишив локально для простоти.
const RAPIDAPI_HOST = 'exercisedb.p.rapidapi.com';
const RAPIDAPI_KEYS: string[] = [
  '5807c7d9ebmshc5ef3fc8c48beffp1aa3d7jsnca03230e0da8',
  '0ac2f8e116msha0aeb3ff8a1fecfp1c1e3fjsn267c946a97ad',
  '19742648b5msh0a471e2a91c926ep141541jsnb293a1b56cf0',
  '123973abd4msh7875c02463e26a7p13f109jsn42225cb671d7'
  // ...
];

let keyIndex = 0;

function isQuotaOrAuthError(err: HttpErrorResponse): boolean {
  if (!err) return false;
  if (err.status === 429 || err.status === 403) return true;
  const msg = (err.error?.message || err.message || '').toLowerCase();
  return msg.includes('you are not subscribed')
    || msg.includes('quota')
    || msg.includes('rate limit')
    || msg.includes('over plan')
    || msg.includes('limit exceeded');
}

function withKey(req: HttpRequest<unknown>, key: string): HttpRequest<unknown> {
  console.log('rapidApiKeyRotationInterceptor=',key)
  // Прибрати можливий rapidapi-key з query, якщо раптом є
  try {
    const u = new URL(req.url, window.location.origin);
    u.searchParams.delete('rapidapi-key');
    return req.clone({
      url: u.toString(),
      setHeaders: {
        'X-RapidAPI-Host': RAPIDAPI_HOST,
        'X-RapidAPI-Key': key
      }
    });
  } catch {
    // Якщо не вдалось розпарсити як URL відносно origin — просто додай заголовки
    return req.clone({
      setHeaders: {
        'X-RapidAPI-Host': RAPIDAPI_HOST,
        'X-RapidAPI-Key': key
      }
    });
  }
}

function nextKey(): string | null {
  if (!RAPIDAPI_KEYS.length) return null;
  keyIndex = (keyIndex + 1) % RAPIDAPI_KEYS.length;
  return RAPIDAPI_KEYS[keyIndex];
}

export function rapidApiKeyRotationInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  // Опційно: обмежити перехоплення тільки на exercisedb host
  if (!req.url.includes(RAPIDAPI_HOST)) {

    return next(req);
  }

  const initialKey = RAPIDAPI_KEYS[keyIndex];
  if (!initialKey) {
    return next(req);
  }

  const firstReq = withKey(req, initialKey);

  return next(firstReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (!isQuotaOrAuthError(err)) {
        return throwError(() => err);
      }

      let attempts = 0;
      const total = RAPIDAPI_KEYS.length;

      const tryNext = (): Observable<HttpEvent<unknown>> => {
        attempts++;
        if (attempts >= total) {
          return throwError(() => err); // всі ключі перепробували
        }
        const key = nextKey();
        if (!key) {
          return throwError(() => err);
        }
        const retried = withKey(req, key);
        return next(retried).pipe(
          catchError((e: HttpErrorResponse) => {
            if (isQuotaOrAuthError(e)) {
              return tryNext();
            }
            return throwError(() => e);
          })
        );
      };

      return tryNext();
    })
  );
}
