import {inject, computed} from '@angular/core';
import {signalStore, withState, withMethods, withComputed, patchState} from '@ngrx/signals';
import {
  Firestore, collection, query, orderBy, limit,
  startAfter, getDocs, doc, getDoc, QueryDocumentSnapshot,
  where, collectionGroup,
} from '@angular/fire/firestore';
import {IExercise} from '../model/Exercise-model';

const PAGE_SIZE = 20;

interface ExerciseState {
  exercises: IExercise[];
  currentBodyPart: string | null;
  lastDoc: QueryDocumentSnapshot | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  selectedExercise: IExercise | null;
  searchQuery: string
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
  searchQuery: '',
};

export const ExerciseStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),

  withComputed((store) => ({
    isEmpty: computed(() => !store.isLoading() && store.exercises().length === 0),
    total: computed(() => store.exercises().length),
    filteredExercises: computed(() => {
      const q = store.searchQuery().toLowerCase().trim();
      if (!q) return store.exercises();
      return store.exercises().filter(e =>
        e.name.toLowerCase().includes(q)
      );
    }),
    // скільки вже завантажено з hasMore — зручно для UI "показано X вправ"
    loadedOf: computed(() => store.hasMore()
      ? `${store.exercises().length}+`
      : `${store.exercises().length}`
    ),
  })),

  withMethods((store) => {
    const firestore = inject(Firestore);

    // шлях: exercises/{bodyPart}/exercises
    function ref(bodyPart: string) {
      return collection(firestore, `exercises/${bodyPart}/exercises`);
    }

    // ── 1. Перша сторінка по групі ────────────────────────────────────────
    async function loadByBodyPart(bodyPart: string): Promise<void> {
      if (store.currentBodyPart() === bodyPart && store.exercises().length > 0) return;

      patchState(store, {
        isLoading: true,
        exercises: [],
        lastDoc: null,
        hasMore: true,
        error: null,
        currentBodyPart: bodyPart,
        searchQuery: '',
      });

      try {
        const snap = await getDocs(query(ref(bodyPart), orderBy('name'), limit(PAGE_SIZE)));
        patchState(store, {
          exercises: snap.docs.map(d => ({id: d.id, ...d.data()} as IExercise)),
          lastDoc: snap.docs.at(-1) ?? null,
          hasMore: snap.docs.length === PAGE_SIZE,
          isLoading: false,
        });
      } catch (e: any) {
        patchState(store, {error: e.message, isLoading: false});
      }
    }

    // ── 2. Наступна сторінка (infinite scroll) ────────────────────────────
    async function loadMore(): Promise<void> {
      const bodyPart = store.currentBodyPart();
      const lastDoc = store.lastDoc();
      if (store.isLoadingMore() || !store.hasMore() || !lastDoc || !bodyPart) return;

      patchState(store, {isLoadingMore: true});
      try {
        const snap = await getDocs(
          query(ref(bodyPart), orderBy('name'), limit(PAGE_SIZE), startAfter(lastDoc))
        );
        patchState(store, {
          exercises: [...store.exercises(), ...snap.docs.map(d => ({id: d.id, ...d.data()} as IExercise))],
          lastDoc: snap.docs.at(-1) ?? lastDoc,
          hasMore: snap.docs.length === PAGE_SIZE,
          isLoadingMore: false,
        });
      } catch (e: any) {
        patchState(store, {error: e.message, isLoadingMore: false});
      }
    }

    // ── 3. Одна вправа по bodyPart + id ──────────────────────────────────
    // спочатку кеш, потім Firestore
    async function loadById(bodyPart: string, exerciseId: string): Promise<void> {
      const cached = store.exercises().find(e => e.id === exerciseId);
      if (cached) {
        patchState(store, {selectedExercise: cached});
        return;
      }

      patchState(store, {isLoading: true, error: null});
      try {
        const snap = await getDoc(doc(firestore, `exercises/${bodyPart}/exercises/${exerciseId}`));
        if (snap.exists()) {
          patchState(store, {
            selectedExercise: {id: snap.id, ...snap.data()} as IExercise,
            isLoading: false,
          });
        } else {
          patchState(store, {error: 'Exercise not found', isLoading: false});
        }
      } catch (e: any) {
        patchState(store, {error: e.message, isLoading: false});
      }
    }

    // ── 4. Всі вправи однієї групи БЕЗ пагінації (для пошуку, експорту) ──
    async function loadAllByBodyPart(bodyPart: string): Promise<IExercise[]> {
      try {
        const snap = await getDocs(query(ref(bodyPart), orderBy('name')));
        return snap.docs.map(d => ({id: d.id, ...d.data()} as IExercise));
      } catch (e: any) {
        patchState(store, {error: e.message});
        return [];
      }
    }

    // ── 5. Пошук по назві в межах поточної групи (з кешу) ─────────────────
    // працює на вже завантажених даних — без Firestore запиту
    function searchInLoaded(term: string): IExercise[] {
      if (!term.trim()) return store.exercises();
      const t = term.toLowerCase();
      return store.exercises().filter(e =>
        e.name.toLowerCase().includes(t)
      );
    }

    // ── 6. Фільтр по equipment / difficulty в межах завантажених ──────────
    function filterLoaded(filters: {
      equipment?: string;
      difficulty?: string;
      category?: string;
    }): IExercise[] {
      return store.exercises().filter(e => {
        if (filters.equipment && e.equipment !== filters.equipment) return false;
        if (filters.difficulty && e.difficulty !== filters.difficulty) return false;
        if (filters.category && e.category !== filters.category) return false;
        return true;
      });
    }

    // ── 7. Завантажити вправи по equipment з Firestore (між групами) ───────
    // корисно для сторінки "всі вправи з гантелями"
    async function loadByEquipment(bodyPart: string, equipment: string): Promise<void> {
      patchState(store, {isLoading: true, error: null});
      try {
        const snap = await getDocs(
          query(ref(bodyPart), where('equipment', '==', equipment), orderBy('name'))
        );
        patchState(store, {
          exercises: snap.docs.map(d => ({id: d.id, ...d.data()} as IExercise)),
          lastDoc: null,
          hasMore: false,
          isLoading: false,
          currentBodyPart: bodyPart,
        });
      } catch (e: any) {
        patchState(store, {error: e.message, isLoading: false});
      }
    }

    // ── Всі вправи де isFavorite = true (з УСІХ груп) ──────────────────────
    const loadFavorites = async (): Promise<void> => {
      patchState(store, {isLoading: true, error: null});
      try {
        // collectionGroup('exercises') — шукає у ВСІХ підколекціях з назвою 'exercises'
        // тобто exercises/back/exercises, exercises/chest/exercises, etc.
        const snap = await getDocs(
          query(
            collectionGroup(firestore, 'exercises'),
            where('isFavorite', '==', true)
          )
        );

        const favorites = snap.docs.map(d => ({id: d.id, ...d.data()} as IExercise));
        patchState(store, {exercises: favorites, isLoading: false});
      } catch (e: any) {
        patchState(store, {error: e.message, isLoading: false});
      }
    };

    const setSearch = (query: string) => {
      patchState(store, {searchQuery: query});
    }

    // ── 8. Скинути стан при зміні групи ───────────────────────────────────
    function reset(): void {
      patchState(store, initialState);
    }

    return {
      loadByBodyPart,   // основний — перша сторінка
      loadMore,         // infinite scroll
      loadById,         // деталі вправи
      loadAllByBodyPart,// всі без пагінації → повертає масив
      searchInLoaded,   // пошук по назві з кешу → повертає масив
      filterLoaded,     // фільтр з кешу → повертає масив
      loadByEquipment,  // Firestore запит по equipment
      loadFavorites,    //Всі вправи де isFavorite = true
      reset,
      setSearch
    };
  }),
);
