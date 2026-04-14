import { inject, Injectable } from '@angular/core';
import {
  Firestore, collection, collectionData,
  doc, docData, setDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {IPersonalRecord} from '../model/Exercise-model';


@Injectable({ providedIn: 'root' })
export class PersonalRecordService {
  private firestore: Firestore;
  constructor() {
    this.firestore = inject(Firestore); // ✅ inject в конструкторі
  }
  private col(uid: string) {
    return collection(this.firestore, `users/${uid}/personalRecords`);
  }

  getAll(uid: string): Observable<IPersonalRecord[]> {
    return collectionData(this.col(uid), { idField: 'exerciseId' }) as Observable<IPersonalRecord[]>;
  }

  getById(uid: string, exerciseId: string): Observable<IPersonalRecord> {
    const ref = doc(this.firestore, `users/${uid}/personalRecords/${exerciseId}`);
    return docData(ref, { idField: 'exerciseId' }) as Observable<IPersonalRecord>;
  }

  async set(uid: string, record: IPersonalRecord): Promise<void> {
    const ref = doc(this.firestore, `users/${uid}/personalRecords/${record.exerciseId}`);
    await setDoc(ref, record, { merge: true });
  }
}
