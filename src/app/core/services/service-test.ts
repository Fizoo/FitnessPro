import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {catchError, delay, map, Observable, of} from 'rxjs';
import {IExercise, IMuscleGroup} from '../model/Exercise-model';
import {bodyPartsData, exercisesData, IData} from '../../../../public/data/data';


@Injectable({
  providedIn: 'root',
})
export class ServiceTest {
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer); // ✅ ДОДАНО

  private USE_MOCK = true;
  private mockData: IData[] = exercisesData;
  private bodyPartsData: IMuscleGroup[] = bodyPartsData;

  private readonly API_URL = 'https://exercisedb.p.rapidapi.com';
  private readonly API_KEY = '19742648b5msh0a471e2a91c926ep141541jsnb293a1b56cf0'; // ✅ Один ключ, не світити в коді

  // ✅ Кеш для SafeUrl щоб не створювати новий об'єкт кожного разу
  private safeUrlCache = new Map<string, SafeUrl>();

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-RapidAPI-Key': this.API_KEY,
      'X-RapidAPI-Host': 'exercisedb.p.rapidок,як скачати,давай для  елемента для тестаapi.com'
    });
  }

  // ✅ ГОЛОВНИЙ МЕТОД - безпечний GIF для детальної сторінки
  getSafeGifUrl(exerciseId: string): SafeUrl {
    if (this.safeUrlCache.has(exerciseId)) {
      return this.safeUrlCache.get(exerciseId)!;
    }
    const url = `${this.API_URL}/image?exerciseId=${exerciseId}&resolution=180&rapidapi-key=${this.API_KEY}`;
    const safeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
    this.safeUrlCache.set(exerciseId, safeUrl);
    return safeUrl;
  }

  // ✅ Для списку - маленька картинка (180px), тільки коли видно елемент
  getSafeStaticUrl(exerciseId: string): SafeUrl {
    const cacheKey = `static_${exerciseId}`;
    if (this.safeUrlCache.has(cacheKey)) {
      return this.safeUrlCache.get(cacheKey)!;
    }
    const url = `${this.API_URL}/image?exerciseId=${exerciseId}&resolution=180&rapidapi-key=${this.API_KEY}`;
    const safeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
    this.safeUrlCache.set(cacheKey, safeUrl);
    return safeUrl;
  }

  getMockBodyPartList(): Observable<IData[]> {
    return of(this.mockData).pipe(delay(500));
  }

  getBodyPartList(): Observable<IMuscleGroup[]> {
    if (this.USE_MOCK) {
      return of(this.bodyPartsData).pipe(
        map(bodyParts => [...bodyParts].sort((a, b) => a.id - b.id)),
        delay(500)
      );
    }

    return this.http.get<string[]>(`${this.API_URL}/exercises/bodyPartList`, {
      headers: this.getHeaders()
    }).pipe(
      map(bodyParts => bodyParts.map((bodyPart, i) => ({
        name: bodyPart,
        id: i,
        exerciseCount: 0,
        imageUrl: `assets/img/${bodyPart}.png`
      }))),
      catchError(err => {
        console.error('getBodyPartList error:', err);
        return of(this.bodyPartsData); // ✅ Fallback на mock
      })
    );
  }

  getExercisesByBodyPart(bodyPart: string, limit = 10, offset = 0): Observable<IExercise[]> {
    if (this.USE_MOCK) {
      const found = this.mockData.find(el => el.params === bodyPart);
      return of(found ? found.data : []).pipe(delay(500));
    }

    return this.http.get<any[]>(`${this.API_URL}/exercises/bodyPart/${bodyPart}`, {
      headers: this.getHeaders(),
      params: { limit: limit.toString(), offset: offset.toString() }
    }).pipe(
      catchError(err => {
        console.error('getExercisesByBodyPart error:', err);
        return of([]);
      })
    );
  }

  getExerciseById(id: string): Observable<IExercise> {
    if (this.USE_MOCK) {
      // ✅ Шукаємо у mock даних
      for (const group of this.mockData) {
        const found = group.data.find(ex => ex.id === id);
        if (found) return of(found).pipe(delay(300));
      }
    }

    return this.http.get<IExercise>(`${this.API_URL}/exercises/exercise/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(err => {
        console.error('getExerciseById error:', err);
        return of({} as IExercise);
      })
    );
  }
}
