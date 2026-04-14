import { inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { Firestore, collection, query, orderBy, limit, startAfter, getDocs, doc, getDoc, QueryDocumentSnapshot } from '@angular/fire/firestore';
import {IExercise} from '../model/Exercise-model';


const PAGE_SIZE = 10;

interface ExerciseState {
  exercises: IExercise[];
  currentBodyPart: string | null;
  lastDoc: QueryDocumentSnapshot | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  selectedExercise: IExercise | null;
}

const initialState: ExerciseState = {
  exercises: [],
  currentBodyPart: null,
  lastDoc: null,
  isLoading: false,
  isLoadingMore: false,
  hasMore: true,
  error: null,
  selectedExercise: null,
};

export const ExerciseStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    isEmpty: computed(() => !store.isLoading() && store.exercises().length === 0),
    total: computed(() => store.exercises().length),
  })),

  withMethods((store) => {
    const firestore = inject(Firestore);

    // ── Завантажити першу сторінку ──
    async function loadByBodyPart(bodyPart: string): Promise<void> {
      // якщо та сама група — не перезавантажуємо
      if (store.currentBodyPart() === bodyPart && store.exercises().length > 0) return;

      patchState(store, {
        isLoading: true,
        exercises: [],
        lastDoc: null,
        hasMore: true,
        error: null,
        currentBodyPart: bodyPart,
      });

      try {
        const ref = collection(firestore, `exercises/${bodyPart}/exercises`);
        const q = query(ref, orderBy('name'), limit(PAGE_SIZE));
        const snap = await getDocs(q);

        const exercises = snap.docs.map(d => ({ id: d.id, ...d.data() } as IExercise));
        const lastDoc = snap.docs[snap.docs.length - 1] ?? null;

        patchState(store, {
          exercises,
          lastDoc,
          hasMore: snap.docs.length === PAGE_SIZE,
          isLoading: false,
        });
      } catch (e: any) {
        patchState(store, { error: e.message, isLoading: false });
      }
    }

    // ── Завантажити наступну сторінку ──
    async function loadMore(): Promise<void> {
      if (store.isLoadingMore() || !store.hasMore() || !store.lastDoc()) return;

      patchState(store, { isLoadingMore: true });

      try {
        const bodyPart = store.currentBodyPart()!;
        const ref = collection(firestore, `exercises/${bodyPart}/exercises`);
        const q = query(ref, orderBy('name'), limit(PAGE_SIZE), startAfter(store.lastDoc()));
        const snap = await getDocs(q);

        const newExercises = snap.docs.map(d => ({ id: d.id, ...d.data() } as IExercise));
        const lastDoc = snap.docs[snap.docs.length - 1] ?? store.lastDoc();

        patchState(store, {
          exercises: [...store.exercises(), ...newExercises],
          lastDoc,
          hasMore: snap.docs.length === PAGE_SIZE,
          isLoadingMore: false,
        });
      } catch (e: any) {
        patchState(store, { error: e.message, isLoadingMore: false });
      }
    }

    // ── Завантажити одну вправу ──
    async function loadById(bodyPart: string, exerciseId: string): Promise<void> {
      // спочатку шукаємо в кеші
      const cached = store.exercises().find(e => e.id === exerciseId);
      if (cached) {
        patchState(store, { selectedExercise: cached });
        return;
      }

      patchState(store, { isLoading: true });
      try {
        const ref = doc(firestore, `exercises/${bodyPart}/exercises/${exerciseId}`);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          patchState(store, {
            selectedExercise: { id: snap.id, ...snap.data() } as IExercise,
            isLoading: false,
          });
        }
      } catch (e: any) {
        patchState(store, { error: e.message, isLoading: false });
      }
    }

    // ── Скинути стан ──
    function reset(): void {
      patchState(store, initialState);
    }

    return { loadByBodyPart, loadMore, loadById, reset };
  })
);
