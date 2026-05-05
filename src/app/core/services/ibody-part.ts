import { inject, Injectable } from '@angular/core';
import {
  Firestore, collection, collectionData,
  doc, writeBatch
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {IData} from '../model/Exercise-model';



interface IBodyPart {
  id: number;
  name: string;
  params: string;
  exerciseCount: number;
}

@Injectable({ providedIn: 'root' })

export class BodyPartService {
  private firestore: Firestore;

  constructor() {
    this.firestore = inject(Firestore); // ✅ inject в конструкторі
  }

  getAll(): Observable<IBodyPart[]> {
    const ref = collection(this.firestore, 'bodyParts');
    return collectionData(ref) as Observable<IBodyPart[]>;
  }

  async uploadBodyParts(data: IData[]): Promise<void> {
    const batch = writeBatch(this.firestore);
    for (const group of data) {
      const ref = doc(this.firestore, `bodyParts/${group.params}`);
      batch.set(ref, {
        id: group.id,
        name: group.name,
        params: group.params,
        exerciseCount: group.exerciseCount,
      });
    }
    await batch.commit();
    console.log('✅ BodyParts uploaded');
  }
}
