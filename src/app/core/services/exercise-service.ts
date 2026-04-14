import { inject, Injectable } from '@angular/core';
import {
  Firestore, collection, collectionData, doc,
  docData, writeBatch, updateDoc, increment
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {IExercise} from '../model/Exercise-model';
import {IData} from '../../../../public/data/data';


@Injectable({ providedIn: 'root' })
export class ExerciseService {
  private firestore: Firestore;
  constructor() {
    this.firestore = inject(Firestore); // ✅ inject в конструкторі
  }

  getByBodyPart(bodyPart: string): Observable<IExercise[]> {
    const ref = collection(this.firestore, `exercises/${bodyPart}/exercises`);
    return collectionData(ref, { idField: 'id' }) as Observable<IExercise[]>;
  }

  getById(bodyPart: string, exerciseId: string): Observable<IExercise> {
    const ref = doc(this.firestore, `exercises/${bodyPart}/exercises/${exerciseId}`);
    return docData(ref, { idField: 'id' }) as Observable<IExercise>;
  }

  async incrementUsage(bodyPart: string, exerciseId: string): Promise<void> {
    const ref = doc(this.firestore, `exercises/${bodyPart}/exercises/${exerciseId}`);
    await updateDoc(ref, { usageCount: increment(1) });
  }

  async uploadExercises(data: IData[]): Promise<void> {
    for (const group of data) {
      const chunks = this.chunk(group.data, 500);
      for (const chunk of chunks) {
        const batch = writeBatch(this.firestore);
        for (const exercise of chunk) {
          const { isFavorite, gifUrl, staticImageUrl, ...clean } = exercise;
          const ref = doc(
            this.firestore,
            `exercises/${group.params}/exercises/${exercise.id}`
          );
          batch.set(ref, { ...clean, usageCount: 0 });
        }
        await batch.commit();
      }
      console.log(`✅ ${group.params}: ${group.data.length} вправ`);
    }
  }

  private chunk<T>(arr: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
  }
}
