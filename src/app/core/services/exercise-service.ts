import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, delay, forkJoin, from, map, Observable, of, switchMap, tap} from 'rxjs';
import {IExercise, IMuscleGroup} from '../model/Exercise-model';
import {bodyPartsData, exercisesData, IData} from '../../../../public/data/data';


@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  private http = inject(HttpClient);
  private USE_MOCK = true;
  private mockData: IData[] = exercisesData
  private bodyPartsData: IMuscleGroup[] = bodyPartsData

  private readonly API_URL = 'https://exercisedb.p.rapidapi.com';
  //private readonly API_KEY = '5807c7d9ebmshc5ef3fc8c48beffp1aa3d7jsnca03230e0da8';
  //private readonly API_KEY2 = '0ac2f8e116msha0aeb3ff8a1fecfp1c1e3fjsn267c946a97ad';//3.11.2025
  private readonly API_KEY3 = '19742648b5msh0a471e2a91c926ep141541jsnb293a1b56cf0';//12.11.2025
  //private readonly API_KEY4 = '123973abd4msh7875c02463e26a7p13f109jsn42225cb671d7';//25.11.2025
  //private readonly API_KEY2 = '1111';

  private staticImageCache = new Map<string, string>();

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      //'X-RapidAPI-Key': this.API_KEY3,
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    });
  }

  // ==================== ОСНОВНІ МЕТОДИ API ====================
  // GET /exercises/bodyPartList - Отримати список груп м'язів
  getMokaBodyPartList(): Observable<IData[]> {
    return of(this.mockData).pipe(
      delay(500)
    )
  }

  getBodyPartList(): Observable<IMuscleGroup[]> {
        if (this.USE_MOCK) {
          // Повертаємо mock дані з затримкою (імітація API)
          return of(this.bodyPartsData).pipe(
            map(bodyParts =>
              [...bodyParts].sort((a, b) => a.id - b.id)
            ),
            delay(500),

          )
        }

    return this.http.get<string[]>(`${this.API_URL}/exercises/bodyPartList`, {
      headers: this.getHeaders()
    }).pipe(
      map((bodyParts,i) => {
        return bodyParts.map((bodyPart, i) => ({
          name: bodyPart,
          id: i,
          exerciseCount: 0,
          imageUrl: `assets/img/${bodyPart}.png`
        }))
      }),
      tap(el => console.log(el))

    )
  }

// GET /exercises/bodyPart/{bodyPart} - Отримати вправи за групою м'язів
  getExercisesByBodyPart(bodyPart: string, limit: number = 10, offset: number = 0): Observable<IExercise[]> {
    if (this.USE_MOCK) {
      // Повертаємо mock дані з затримкою (імітація API)
      const found = this.mockData.find(el => el.params === bodyPart);
      console.log('getExercisesByBodyPart USE_MOCK:')
      console.log(found)

      return of(found ? found.data : []).pipe(
        delay(500));
    }

    return this.http.get<any[]>(`${this.API_URL}/exercises/bodyPart/${bodyPart}`, {
      headers: this.getHeaders(),
      params: {
        limit: limit.toString(),
        offset: offset.toString()
      }
    }).pipe(
      tap(el => console.log(el)),
      switchMap(exercises => this.mapExercises(exercises)),
      tap(el => console.log(el))
    );
  }

  // GET /exercises/exercise/{id} - Отримати деталі вправи за ID
  getExerciseById(id: string): Observable<IExercise> {
    return this.http.get<any>(`${this.API_URL}/exercises/exercise/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      switchMap(ex => this.mapExerciseWithStaticImage(ex))
    );
  }

  // GET /image - Отримати GIF зображення вправи
  getExerciseImageUrl(exerciseId: string, resolution: '180' | '360' | '720' | '1080' = '180'): string {
    return `${this.API_URL}/image?exerciseId=${exerciseId}&resolution=${resolution}&rapidapi-key=${this.API_KEY3}`
  }


  getExerciseImageBlob(id: string, res: '180' | '360' | '720' | '1080' = '180') {
    const url = `${this.API_URL}/image?exerciseId=${id}&resolution=${res}`;
    return this.http.get(url, {headers: this.getHeaders(), responseType: 'blob'});
  }
  // Створити Object URL з Blob (зручно для <img [src]>)
  getExerciseImageObjectUrl$(
    exerciseId: string,
    resolution: '180' | '360' | '720' | '1080' = '180'
  ) {
    return this.getExerciseImageBlob(exerciseId, resolution).pipe(
      map(blob => URL.createObjectURL(blob)),
      tap(el=>console.log(el))
    );
  }

  // Отримати групи м'язів з зображеннями
  /*  getMuscleGroups(): Observable<IMuscleGroup[]> {
      return this.getBodyPartList().pipe(
        map(bodyParts => bodyParts.map(part => ({
          id: part,
          name: this.formatBodyPartName(part),
          exerciseCount: 0,
          imageUrl: this.getBodyPartImage(part)
        })))
      );
    }*/


  // ==================== ПРИВАТНІ МЕТОДИ ====================
  // Маппінг масиву вправ зі статичними зображеннями
  private mapExercises(exercises: any[]): Observable<IExercise[]> {
    if (exercises.length === 0) {
      return of([]);
    }

    const mappedExercises = exercises.map(ex => this.mapExerciseWithStaticImage(ex));
    return forkJoin(mappedExercises);
  }

  // Маппінг однієї вправи зі статичним зображенням
  private mapExerciseWithStaticImage(data: IExercise): Observable<IExercise> {
    const gifUrl = ''
    // const gifUrl = data.gifUrl
    //const gifUrl = this.getExerciseImageUrl(data.id, '180');

    const baseExercise: IExercise = {
      id: data.id,
      name: data.name,
      gifUrl: gifUrl,
      staticImageUrl: '', // Буде заповнено нижче
      bodyPart: data.bodyPart,
      target: data.target,
      equipment: data.equipment,
      secondaryMuscles: data.secondaryMuscles || [],
      instructions: data.instructions || [],
      description: data.description || '',
      difficulty: data.difficulty || 'beginner',
      category: data.category || 'strength'
    };

    // Конвертуємо GIF → статичне зображення
    return from(this.getGifFirstFrame(gifUrl)).pipe(
      map(staticImageUrl => ({
        ...baseExercise,
        //staticImageUrl: ''
        staticImageUrl: staticImageUrl
      })),
      catchError(() => of({
        ...baseExercise,
        staticImageUrl: gifUrl // Fallback до GIF
      }))
    );
  }

  // Отримати перший кадр з GIF
  private getGifFirstFrame(gifUrl: string): Promise<string> {
    // Перевірка кешу
    if (this.staticImageCache.has(gifUrl)) {
      return Promise.resolve(this.staticImageCache.get(gifUrl)!);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = gifUrl;
      //img.src = '';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject('No canvas context');
        }

        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');

        // Зберігаємо в кеш
        this.staticImageCache.set(gifUrl, dataUrl);

        resolve(dataUrl);
      };

      img.onerror = (error) => reject(error);
    });
  }

  // Форматування назви групи м'язів
  private formatBodyPartName(bodyPart: string): string {
    return bodyPart
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Отримати зображення для групи м'язів (з assets або Firebase)
  private getBodyPartImage(bodyPart: string) {
    // TODO: Замінити на Firebase URLs після завантаження
    const imageMap: { [key: string]: string } = {
      'back': '/assets/images/muscle-groups/back.jpg',
      'cardio': '/assets/images/muscle-groups/cardio.jpg',
      'chest': '/assets/images/muscle-groups/chest.jpg',
      'lower arms': '/assets/images/muscle-groups/lower-arms.jpg',
      'lower legs': '/assets/images/muscle-groups/lower-legs.jpg',
      'neck': '/assets/images/muscle-groups/neck.jpg',
      'shoulders': '/assets/images/muscle-groups/shoulders.jpg',
      'upper arms': '/assets/images/muscle-groups/upper-arms.jpg',
      'upper legs': '/assets/images/muscle-groups/upper-legs.jpg',
      'waist': '/assets/images/muscle-groups/waist.jpg'
    };
  }

  /*// Отримати всі групи м'язів

  // Отримати вправи за групою м'язів
/!*
  getExercisesByBodyPart(bodyPart: string, limit: number = 100, offset: number = 0): Observable<IExercise[]> {
    return this.http.get<any[]>(`${this.API_URL}/exercises/bodyPart/${bodyPart}`, {
      headers: this.getHeaders(),
      params: {
        limit: limit.toString(),
        offset: offset.toString()
      }
    }).pipe(
      map(exercises => exercises.map(ex => this.mapExercise(ex)))
    );
  }
*!/

  getAllExercises(limit: number = 20, offset: number = 0): Observable<IExercise[]> {
    return this.http.get<any[]>(`${this.API_URL}/exercises`, {
      headers: this.getHeaders(),
      params: {
        limit: limit.toString(),
        offset: offset.toString()
      }
    }).pipe(
      map(exercises => exercises.map(ex => this.mapExercise(ex)))
    );
  }

  // Отримати вправу за ID зі статичним зображенням
  getExerciseByIdWithStaticImage(id: string): Observable<IExercise> {
    return this.getExerciseById(id).pipe(
      switchMap(exercise =>
        from(this.getGifFirstFrame(exercise.gifUrl)).pipe(
          map(staticImageUrl => ({
            ...exercise,
            staticImageUrl
          })),
          catchError(() => of({ ...exercise, staticImageUrl: exercise.gifUrl })) // Fallback до GIF
        )
      )
    );
  }

  // Отримати вправи з статичними зображеннями
  getExercisesByBodyPartWithStaticImages(bodyPart: string, limit: number = 50, offset: number = 0): Observable<IExercise[]> {
    return this.getExercisesByBodyPart(bodyPart, limit, offset).pipe(
      switchMap(exercises => {
        // Конвертуємо GIF → статичні зображення для кожної вправи
        const conversions = exercises.map(exercise =>
          from(this.getGifFirstFrame(exercise.gifUrl)).pipe(
            map(staticImageUrl => ({
              ...exercise,
              staticImageUrl
            })),
            catchError(() => of({ ...exercise, staticImageUrl: exercise.gifUrl })) // Fallback до GIF
          )
        );

        return conversions.length > 0 ? forkJoin(conversions) : of([]);
      })
    );
  }

  getExerciseImageUrl(exerciseId: string, resolution: '180' | '360' | '720' | '1080' = '360'): string {
    return `${this.API_URL}/image?exerciseId=${exerciseId}&resolution=${resolution}&rapidapi-key=${this.API_KEY}`;
  }

  // Маппінг даних з API
  private mapExercise(data: IExercise): IExercise {
    const gifUrl = this.getExerciseImageUrl(data.id, '360');

    return {
      id: data.id,
      name: data.name,
      gifUrl: gifUrl,
      staticImageUrl: gifUrl, // Буде конвертовано в компоненті
      bodyPart: data.bodyPart,
      target: data.target,
      equipment: data.equipment,
      secondaryMuscles: data.secondaryMuscles || [],
      instructions: data.instructions || [],
      description: data.description || '',
      difficulty: data.difficulty || 'beginner',
      category: data.category || 'strength'
    };
  }

// Отримати перший кадр з GIF
  getGifFirstFrame(gifUrl: string): Promise<string> {
    // Перевірка кешу
    if (this.staticImageCache.has(gifUrl)) {
      return Promise.resolve(this.staticImageCache.get(gifUrl)!);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // важливо для CORS
      img.src = gifUrl;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject('No canvas context');
        }

        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');

        // Зберігаємо в кеш
        this.staticImageCache.set(gifUrl, dataUrl);

        resolve(dataUrl);
      };

      img.onerror = (error) => reject(error);
    });
  }
*/


}

/*import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, from, switchMap, forkJoin, of, catchError } from 'rxjs';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Category = 'strength' | 'cardio' | 'mobility' | 'balance' | 'stretching' | 'plyometrics' | 'rehabilitation';

export interface Exercise {
  id: string;
  name: string;
  gifUrl: string;
  staticImageUrl: string;
  bodyPart: string;
  target: string;
  equipment: string;
  secondaryMuscles: string[];
  instructions: string[];
  description: string;
  difficulty: Difficulty;
  category: Category;
}

export interface MuscleGroup {
  id: string;
  name: string;
  exerciseCount: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private http = inject(HttpClient);

  private readonly API_URL = 'https://exercisedb.p.rapidapi.com';
  private readonly API_KEY = '5807c7d9ebmshc5ef3fc8c48beffp1aa3d7jsnca03230e0da8';

  // Кеш для статичних зображень
  private staticImageCache = new Map<string, string>();

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'x-rapidapi-key': this.API_KEY,
      'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
    });
  }

  // ==================== ОСНОВНІ МЕТОДИ API ====================

  // GET /exercises/bodyPartList - Отримати список груп м'язів
  getBodyPartList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/exercises/bodyPartList`, {
      headers: this.getHeaders()
    });
  }

  // GET /exercises/bodyPart/{bodyPart} - Отримати вправи за групою м'язів
  getExercisesByBodyPart(bodyPart: string, limit: number = 50, offset: number = 0): Observable<Exercise[]> {
    return this.http.get<any[]>(`${this.API_URL}/exercises/bodyPart/${bodyPart}`, {
      headers: this.getHeaders(),
      params: {
        limit: limit.toString(),
        offset: offset.toString()
      }
    }).pipe(
      switchMap(exercises => this.mapExercises(exercises))
    );
  }

  // GET /exercises/exercise/{id} - Отримати деталі вправи за ID
  getExerciseById(id: string): Observable<Exercise> {
    return this.http.get<any>(`${this.API_URL}/exercises/exercise/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      switchMap(ex => this.mapExerciseWithStaticImage(ex))
    );
  }

  // GET /exercises/name/{name} - Пошук вправ за назвою
  searchExercisesByName(name: string, limit: number = 20, offset: number = 0): Observable<Exercise[]> {
    return this.http.get<any[]>(`${this.API_URL}/exercises/name/${name}`, {
      headers: this.getHeaders(),
      params: {
        limit: limit.toString(),
        offset: offset.toString()
      }
    }).pipe(
      switchMap(exercises => this.mapExercises(exercises))
    );
  }

  // GET /exercises - Отримати всі вправи
  getAllExercises(limit: number = 20, offset: number = 0): Observable<Exercise[]> {
    return this.http.get<any[]>(`${this.API_URL}/exercises`, {
      headers: this.getHeaders(),
      params: {
        limit: limit.toString(),
        offset: offset.toString()
      }
    }).pipe(
      switchMap(exercises => this.mapExercises(exercises))
    );
  }

  // GET /exercises/equipmentList - Отримати список обладнання
  getEquipmentList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/exercises/equipmentList`, {
      headers: this.getHeaders()
    });
  }

  // GET /exercises/equipment/{type} - Отримати вправи за типом обладнання
  getExercisesByEquipment(equipment: string, limit: number = 20, offset: number = 0): Observable<Exercise[]> {
    return this.http.get<any[]>(`${this.API_URL}/exercises/equipment/${equipment}`, {
      headers: this.getHeaders(),
      params: {
        limit: limit.toString(),
        offset: offset.toString()
      }
    }).pipe(
      switchMap(exercises => this.mapExercises(exercises))
    );
  }

  // GET /exercises/targetList - Отримати список цільових м'язів
  getTargetList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/exercises/targetList`, {
      headers: this.getHeaders()
    });
  }

  // GET /exercises/target/{target} - Отримати вправи за цільовим м'язом
  getExercisesByTarget(target: string, limit: number = 20, offset: number = 0): Observable<Exercise[]> {
    return this.http.get<any[]>(`${this.API_URL}/exercises/target/${target}`, {
      headers: this.getHeaders(),
      params: {
        limit: limit.toString(),
        offset: offset.toString()
      }
    }).pipe(
      switchMap(exercises => this.mapExercises(exercises))
    );
  }

  // GET /image - Отримати GIF зображення вправи
  getExerciseImageUrl(exerciseId: string, resolution: '180' | '360' | '720' | '1080' = '360'): string {
    return `${this.API_URL}/image?exerciseId=${exerciseId}&resolution=${resolution}&rapidapi-key=${this.API_KEY}`;
  }

  // Отримати групи м'язів з зображеннями
  getMuscleGroups(): Observable<MuscleGroup[]> {
    return this.getBodyPartList().pipe(
      map(bodyParts => bodyParts.map(part => ({
        id: part,
        name: this.formatBodyPartName(part),
        exerciseCount: 0,
        imageUrl: this.getBodyPartImage(part)
      })))
    );
  }

  // ==================== ПРИВАТНІ МЕТОДИ ====================

  // Маппінг масиву вправ зі статичними зображеннями
  private mapExercises(exercises: any[]): Observable<Exercise[]> {
    if (exercises.length === 0) {
      return of([]);
    }

    const mappedExercises = exercises.map(ex => this.mapExerciseWithStaticImage(ex));
    return forkJoin(mappedExercises);
  }

  // Маппінг однієї вправи зі статичним зображенням
  private mapExerciseWithStaticImage(data: any): Observable<Exercise> {
    const gifUrl = this.getExerciseImageUrl(data.id, '360');

    const baseExercise: Exercise = {
      id: data.id,
      name: data.name,
      gifUrl: gifUrl,
      staticImageUrl: '', // Буде заповнено нижче
      bodyPart: data.bodyPart,
      target: data.target,
      equipment: data.equipment,
      secondaryMuscles: data.secondaryMuscles || [],
      instructions: data.instructions || [],
      description: data.description || '',
      difficulty: data.difficulty || 'beginner',
      category: data.category || 'strength'
    };

    // Конвертуємо GIF → статичне зображення
    return from(this.getGifFirstFrame(gifUrl)).pipe(
      map(staticImageUrl => ({
        ...baseExercise,
        staticImageUrl
      })),
      catchError(() => of({
        ...baseExercise,
        staticImageUrl: gifUrl // Fallback до GIF
      }))
    );
  }

  // Отримати перший кадр з GIF
  private getGifFirstFrame(gifUrl: string): Promise<string> {
    // Перевірка кешу
    if (this.staticImageCache.has(gifUrl)) {
      return Promise.resolve(this.staticImageCache.get(gifUrl)!);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = gifUrl;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject('No canvas context');
        }

        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');

        // Зберігаємо в кеш
        this.staticImageCache.set(gifUrl, dataUrl);

        resolve(dataUrl);
      };

      img.onerror = (error) => reject(error);
    });
  }

  // Форматування назви групи м'язів
  private formatBodyPartName(bodyPart: string): string {
    return bodyPart
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Отримати зображення для групи м'язів (з assets або Firebase)
  private getBodyPartImage(bodyPart: string): string {
    // TODO: Замінити на Firebase URLs після завантаження
    const imageMap: { [key: string]: string } = {
      'back': '/assets/images/muscle-groups/back.jpg',
      'cardio': '/assets/images/muscle-groups/cardio.jpg',
      'chest': '/assets/images/muscle-groups/chest.jpg',
      'lower arms': '/assets/images/muscle-groups/lower-arms.jpg',
      'lower legs': '/assets/images/muscle-groups/lower-legs.jpg',
      'neck': '/assets/images/muscle-groups/neck.jpg',
      'shoulders': '/assets/images/muscle-groups/shoulders.jpg',
      'upper arms': '/assets/images/muscle-groups/upper-arms.jpg',
      'upper legs': '/assets/images/muscle-groups/upper-legs.jpg',
      'waist': '/assets/images/muscle-groups/waist.jpg'
    };

    // Fallback до placeholder якщо зображення не знайдено
    if (!imageMap[bodyPart]) {
      const colors = ['667eea', 'f093fb', '4facfe', '43e97b', 'fa709a', '30cfd0', 'a8edea', 'ff9a9e', 'ffecd2', 'ff6e7f'];
      const colorIndex = bodyPart.length % colors.length;
      return `https://via.placeholder.com/400x300/${colors[colorIndex]}/ffffff?text=${encodeURIComponent(this.formatBodyPartName(bodyPart))}`;
    }

    return imageMap[bodyPart];
  }
}*/
