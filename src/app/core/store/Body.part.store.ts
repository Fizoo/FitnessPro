import {computed, inject} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {collection, Firestore, getDocs,} from '@angular/fire/firestore';

// ──────────────────────────────────────────────
// Модель (відповідає полям у Firestore bodyParts/{id})
// ──────────────────────────────────────────────
export interface IBodyPart {
  id: string;        // document id, напр. "back"
  name: string;      // "back"
  params: string;    // "back"  (використовується як route param)
  exerciseCount: number;
  imageUrl: string;
}

interface BodyPartState {
  bodyParts: IBodyPart[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BodyPartState = {
  bodyParts: [],
  isLoading: false,
  error: null,
};

export const BodyPartStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),

  withComputed((store) => ({
    // true поки масив порожній і не грузиться
    isEmpty: computed(() => !store.isLoading() && store.bodyParts().length === 0),
    bodyParts: computed(() => store.bodyParts()),
  })),

  withMethods((store) => {
    const firestore = inject(Firestore);


    // ── Завантажити всі групи м'язів ──────────────────────────────────────────
    // Колекція: bodyParts  (кожен документ = одна група, id = "back", "chest"...)
    const loadAll = async (): Promise<void> => {
      // не завантажуємо повторно якщо вже є дані
      if (store.bodyParts().length > 0) return;

      patchState(store, {isLoading: true, error: null});

      try {
        const ref = collection(firestore, 'bodyParts');
        const snap = await getDocs(ref);

        const bodyParts = snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        } as IBodyPart))
          .sort((a, b) => a.name.localeCompare(b.name)) // якщо id числове

        patchState(store, {bodyParts, isLoading: false});
      } catch (e: any) {
        patchState(store, {error: e.message, isLoading: false});
      }
    };

    // по id → IBodyPart | undefined
    const getById = (id: string) => store.bodyParts().find(b => b.id === id);

    // по name (case-insensitive) → IBodyPart | undefined
    const getByName = (name: string) => store.bodyParts().find(
      b => b.name.toLowerCase() === name.toLowerCase()
    );

    // по id І name одночасно (обидва мають співпасти)
    const getByIdAndName = (id: string, name: string) => store.bodyParts().find(
      b => b.id === id && b.name.toLowerCase() === name.toLowerCase()
    );

    // тільки imageUrl по id → string | null
    const getImageById = (id: string): string | null => store.bodyParts().find(b => b.id === id)?.imageUrl ?? null;

    // чи існує запис з таким id
    const exists = (id: string): boolean => store.bodyParts().some(b => b.id === id);

    return {loadAll, getById, getByName, getByIdAndName, getImageById, exists};

  })
);
