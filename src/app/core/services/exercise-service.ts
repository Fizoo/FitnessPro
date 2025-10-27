import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';
import {IExercise, IMuscleGroup} from '../model/Exercise-model';


@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private http = inject(HttpClient);

  private readonly API_URL = 'https://exercisedb.p.rapidapi.com';
  private readonly API_KEY = '5807c7d9ebmshc5ef3fc8c48beffp1aa3d7jsnca03230e0da8';

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-RapidAPI-Key': this.API_KEY,
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    });
  }

  // Отримати всі групи м'язів
  getBodyPartList(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/exercises/bodyPartList`, {
      headers: this.getHeaders()
    });
  }

  // Отримати вправи за групою м'язів
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

  // Отримати групи м'язів з кількістю вправ
/*  getMuscleGroups(): Observable<IMuscleGroup[]> {
    return this.getBodyPartList().pipe(
      tap(el=>console.log(el)),
      map(bodyParts => bodyParts.map(part => ({
        id: part,
        name: this.formatBodyPartName(part),
        exerciseCount: 0, // Буде оновлено після завантаження
        imageUrl: this.getBodyPartImage(part)
      })))
    );
  }*/
  // Маппінг даних з API
  private mapExercise(data: any): IExercise {
    return {
      id: data.id,
      name: data.name,
      gifUrl: data.gifUrl,
      bodyPart: data.bodyPart,
      equipment: data.equipment,
      target: data.target,
      secondaryMuscles: data.secondaryMuscles || [],
      instructions: data.instructions || []
    };
  }
}
