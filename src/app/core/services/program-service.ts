import { inject, Injectable } from '@angular/core';
import {
  Firestore, collection, collectionData, doc,
  docData, addDoc, updateDoc, deleteDoc, serverTimestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface IProgram {
  id?: string;
  name: string;
  days: IProgramDay[];
  createdAt?: unknown;
}

export interface IProgramDay {
  dayId: number;
  name: string;
  exercises: { exerciseId: string; bodyPart: string }[];
}

@Injectable({ providedIn: 'root' })
export class ProgramService {
  private firestore: Firestore;
  constructor() {
    this.firestore = inject(Firestore); // ✅ inject в конструкторі
  }
  private col(uid: string) {
    return collection(this.firestore, `users/${uid}/programs`);
  }

  getAll(uid: string): Observable<IProgram[]> {
    return collectionData(this.col(uid), { idField: 'id' }) as Observable<IProgram[]>;
  }

  getById(uid: string, programId: string): Observable<IProgram> {
    const ref = doc(this.firestore, `users/${uid}/programs/${programId}`);
    return docData(ref, { idField: 'id' }) as Observable<IProgram>;
  }

  async create(uid: string, program: Omit<IProgram, 'id'>): Promise<string> {
    const ref = await addDoc(this.col(uid), {
      ...program,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  }

  async update(uid: string, programId: string, data: Partial<IProgram>): Promise<void> {
    await updateDoc(doc(this.firestore, `users/${uid}/programs/${programId}`), { ...data });
  }

  async delete(uid: string, programId: string): Promise<void> {
    await deleteDoc(doc(this.firestore, `users/${uid}/programs/${programId}`));
  }
}
