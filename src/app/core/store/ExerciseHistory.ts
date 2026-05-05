import {computed, inject} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import {Auth} from '@angular/fire/auth';
import {IExerciseSession} from '../model/Exercise-model';

interface ExerciseHistoryState {
  sessions: IExerciseSession[];       // історія поточної вправи
  isLoading: boolean;
  error: string | null;
  currentExerciseId: string | null;
}

const initialState: ExerciseHistoryState = {
  sessions: [],
  isLoading: false,
  error: null,
  currentExerciseId: null,
};

export const ExerciseHistoryStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    // скільки сесій загально
    totalSessions: computed(() => store.sessions().length),

    // всі підходи з усіх сесій — для статистики
    allSets: computed(() =>
      store.sessions().flatMap(s => s.sets)
    ),

    // групування по даті для відображення як на скріншоті
    // { "2026-03-03": [session], "2026-02-28": [session] }
    sessionsByDate: computed(() => {
      const map = new Map<string, IExerciseSession[]>();
      for (const s of store.sessions()) {
        const arr = map.get(s.date) ?? [];
        arr.push(s);
        map.set(s.date, arr);
      }
      return map;
    }),
  })),

  withMethods((store) => {
    const firestore = inject(Firestore);
    const auth      = inject(Auth);

    function historyRef() {
      const uid = auth.currentUser!.uid;
      return collection(firestore, `users/${uid}/exerciseHistory`);
    }

    function sessionDocRef(sessionId: string) {
      const uid = auth.currentUser!.uid;
      return doc(firestore, `users/${uid}/exerciseHistory/${sessionId}`);
    }

    // ── 1. Завантажити всю історію по вправі ──────────────────────────────
    async function loadByExerciseId(exerciseId: string): Promise<void> {
      if (store.currentExerciseId() === exerciseId && store.sessions().length > 0) return;

      patchState(store, { isLoading: true, error: null, currentExerciseId: exerciseId });
      try {
        const snap = await getDocs(
          query(historyRef(),
            where('exerciseId', '==', exerciseId),
            orderBy('date', 'desc')   // нові зверху
          )
        );
        patchState(store, {
          sessions:  snap.docs.map(d => ({ id: d.id, ...d.data() } as IExerciseSession)),
          isLoading: false,
        });
      } catch (e: any) {
        patchState(store, { error: e.message, isLoading: false });
      }
    }

    // ── 2. Історія по конкретній даті (всі вправи того дня) ───────────────
    async function loadByDate(date: string): Promise<IExerciseSession[]> {
      try {
        const snap = await getDocs(
          query(historyRef(), where('date', '==', date), orderBy('exerciseId'))
        );
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as IExerciseSession));
      } catch (e: any) {
        patchState(store, { error: e.message });
        return [];
      }
    }

    // ── 3. Останні N сесій по вправі ──────────────────────────────────────
    async function loadLastN(exerciseId: string, n: number): Promise<IExerciseSession[]> {
      try {
        const snap = await getDocs(
          query(historyRef(),
            where('exerciseId', '==', exerciseId),
            orderBy('date', 'desc'),
            limit(n)
          )
        );
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as IExerciseSession));
      } catch (e: any) {
        patchState(store, { error: e.message });
        return [];
      }
    }

    // ── 4. Додати нову сесію ───────────────────────────────────────────────
    async function addSession(
      session: Omit<IExerciseSession, 'id'>
    ): Promise<string | null> {
      try {
        const docRef = await addDoc(historyRef(), session);
        const newSession = { id: docRef.id, ...session };
        patchState(store, { sessions: [newSession, ...store.sessions()] });
        return docRef.id;
      } catch (e: any) {
        patchState(store, { error: e.message });
        return null;
      }
    }

    // ── 5. Оновити коментар на сесію ──────────────────────────────────────
    async function updateSessionComment(sessionId: string, comment: string): Promise<void> {
      try {
        await updateDoc(sessionDocRef(sessionId), { comment });
        patchState(store, {
          sessions: store.sessions().map(s =>
            s.id === sessionId ? { ...s, comment } : s
          ),
        });
      } catch (e: any) {
        patchState(store, { error: e.message });
      }
    }

    // ── 6. Оновити коментар на конкретний підхід ──────────────────────────
    async function updateSetComment(
      sessionId: string,
      setNum: number,
      comment: string
    ): Promise<void> {
      try {
        const session = store.sessions().find(s => s.id === sessionId);
        if (!session) return;

        const updatedSets = session.sets.map(s =>
          s.setNum === setNum ? { ...s, comment } : s
        );

        await updateDoc(sessionDocRef(sessionId), { sets: updatedSets });
        patchState(store, {
          sessions: store.sessions().map(s =>
            s.id === sessionId ? { ...s, sets: updatedSets } : s
          ),
        });
      } catch (e: any) {
        patchState(store, { error: e.message });
      }
    }

    // ── 7. Видалити сесію ─────────────────────────────────────────────────
    async function deleteSession(sessionId: string): Promise<void> {
      try {
        await deleteDoc(sessionDocRef(sessionId));
        patchState(store, {
          sessions: store.sessions().filter(s => s.id !== sessionId),
        });
      } catch (e: any) {
        patchState(store, { error: e.message });
      }
    }

    // ── 8. Максимальна вага по вправі (1RM estimate) ──────────────────────
    // береться найважчий підхід з будь-якої сесії
    function getMaxWeight(): number {
      return Math.max(
        0,
        ...store.sessions().flatMap(s => s.sets.map(set => set.weight))
      );
    }

    // ── 9. Середня вага по вправі ─────────────────────────────────────────
    function getAvgWeight(): number {
      const allSets = store.sessions().flatMap(s => s.sets);
      if (!allSets.length) return 0;
      const total = allSets.reduce((sum, s) => sum + s.weight, 0);
      return Math.round(total / allSets.length * 10) / 10;
    }

    // ── 10. Прогрес — порівняння останніх двох сесій ──────────────────────
    // повертає: positive = прогрес, negative = регрес, null = мало даних
    function getProgress(): { diff: number; percent: number } | null {
      const sorted = [...store.sessions()].sort((a, b) => b.date.localeCompare(a.date));
      if (sorted.length < 2) return null;

      const lastMax = Math.max(...sorted[0].sets.map(s => s.weight));
      const prevMax = Math.max(...sorted[1].sets.map(s => s.weight));
      if (!prevMax) return null;

      const diff    = lastMax - prevMax;
      const percent = Math.round((diff / prevMax) * 100);
      return { diff, percent };
    }

    // ── 11. Скинути при переході на іншу вправу ───────────────────────────
    function reset(): void {
      patchState(store, initialState);
    }

    return {
      loadByExerciseId,
      loadByDate,
      loadLastN,
      addSession,
      updateSessionComment,
      updateSetComment,
      deleteSession,
      getMaxWeight,
      getAvgWeight,
      getProgress,
      reset,
    };
  })
);
