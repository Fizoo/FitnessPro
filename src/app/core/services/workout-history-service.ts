import { inject, Injectable } from '@angular/core';
import {
  Firestore, collection, collectionData,
  doc, docData, addDoc, serverTimestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {IWorkoutHistory} from '../model/Exercise-model';


@Injectable({ providedIn: 'root' })
export class WorkoutHistoryService {
  private firestore: Firestore;
  constructor() {
    this.firestore = inject(Firestore); // ✅ inject в конструкторі
  }

  private col(uid: string) {
    return collection(this.firestore, `users/${uid}/workoutHistory`);
  }

  getAll(uid: string): Observable<IWorkoutHistory[]> {
    return collectionData(this.col(uid), { idField: 'id' }) as Observable<IWorkoutHistory[]>;
  }

  getById(uid: string, historyId: string): Observable<IWorkoutHistory> {
    const ref = doc(this.firestore, `users/${uid}/workoutHistory/${historyId}`);
    return docData(ref, { idField: 'id' }) as Observable<IWorkoutHistory>;
  }

  async add(uid: string, workout: Omit<IWorkoutHistory, 'id'>): Promise<string> {
    const ref = await addDoc(this.col(uid), {
      ...workout,
      date: serverTimestamp(),
    });
    return ref.id;
  }
}
