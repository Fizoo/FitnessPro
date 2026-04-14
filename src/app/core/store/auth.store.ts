import { inject } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';
import {
  Auth, onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut, updateProfile,
  signInWithPopup, GoogleAuthProvider, FacebookAuthProvider,
  GithubAuthProvider, User
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import {IUser} from '../../features/auth/models/user';
import {NotificationService} from '../services/notification-service';


type AuthStatus = 'idle' | 'loading' | 'success' | 'error';

interface AuthState {
  currentUser: IUser | null;
  isInitialized: boolean;
  isLoading: boolean;
  status: AuthStatus;
  error: string | null;
}

const initialState: AuthState = {
  currentUser: null,
  isInitialized: false,
  isLoading: false,
  status: 'idle',
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    isLoggedIn: computed(() => !!store.currentUser()),
    uid: computed(() => store.currentUser()?.uid ?? null),
    displayName: computed(() => store.currentUser()?.displayName ?? ''),
    email: computed(() => store.currentUser()?.email ?? ''),
    photoURL: computed(() => store.currentUser()?.photoURL ?? null),
    initials: computed(() => {
      const name = store.currentUser()?.displayName;
      return name ? name.charAt(0).toUpperCase() : '?';
    }),
  })),

  withMethods((store) => {
    const firebaseAuth = inject(Auth);
    const firestore = inject(Firestore);
    const notify = inject(NotificationService);
    let isRegistering = false;

    // ── Init (викликати один раз в app.component) ──
    function init(): void {
      onAuthStateChanged(firebaseAuth, async (user) => {
        if (isRegistering) return;
        if (user) {
          try {
            const snap = await getDoc(doc(firestore, 'users', user.uid));
            if (snap.exists() && snap.data()['email']) {
              patchState(store, { currentUser: snap.data() as IUser });
            } else {
              await createUserDoc(user, user.displayName ?? user.email ?? '');
            }
          } catch (e) {
            console.error('onAuthStateChanged error:', e);
          }
        } else {
          patchState(store, { currentUser: null });
        }
        patchState(store, { isInitialized: true });
      });
    }

    // ── Register ──
    async function register(email: string, password: string, username: string): Promise<void> {
      await run(async () => {
        isRegistering = true;
        try {
          const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
          await updateProfile(cred.user, { displayName: username });
          await createUserDoc(cred.user, username);
          patchState(store, { isInitialized: true });
          notify.success('Реєстрація успішна! 🎉');
        } finally {
          isRegistering = false;
        }
      });
    }

    // ── Login ──
    async function login(email: string, password: string): Promise<void> {
      await run(async () => {
        const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
        await loadAndSetUser(cred.user);
        notify.success('Вхід успішний! 👋');
      });
    }

    // ── OAuth ──
    async function loginWithGoogle(): Promise<void> {
      await loginWithProvider(new GoogleAuthProvider());
      notify.success('Вхід успішний! 👋');
    }

    async function loginWithFacebook(): Promise<void> {
      await loginWithProvider(new FacebookAuthProvider());
      notify.success('Вхід успішний! 👋');
    }

    async function loginWithGitHub(): Promise<void> {
      await loginWithProvider(new GithubAuthProvider());
      notify.success('Вхід успішний! 👋');
    }

    // ── Logout ──
    async function logout(): Promise<void> {
      await run(async () => {
        await signOut(firebaseAuth);
        patchState(store, { currentUser: null });
        notify.success('До побачення! 👋');
      });
    }

    // ── Update user (для ProfilePage) ──
    function updateUser(partial: Partial<IUser>): void {
      const current = store.currentUser();
      if (!current) return;
      patchState(store, { currentUser: { ...current, ...partial } });
    }

    // ── Private helpers ──
    async function loginWithProvider(
      provider: GoogleAuthProvider | FacebookAuthProvider | GithubAuthProvider
    ): Promise<void> {
      await run(async () => {
        const cred = await signInWithPopup(firebaseAuth, provider);
        const snap = await getDoc(doc(firestore, 'users', cred.user.uid));
        if (snap.exists() && snap.data()['email']) {
          await loadAndSetUser(cred.user);
        } else {
          await createUserDoc(cred.user, cred.user.displayName ?? '');
        }
        notify.success('Вхід успішний! 👋');
      });
    }

    async function createUserDoc(user: User, username: string): Promise<void> {
      const newUser: IUser = {
        uid: user.uid,
        email: user.email ?? '',
        displayName: username,
        photoURL: user.photoURL ?? '',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        age: null,
        gender: null,
        height: null,
        weight: null,
        fitnessGoal: null,
        activeProgramId: null,
        settings: {
          weightUnit: 'kg',
          language: 'uk',
          notifications: true,
          theme: 'dark',
        },
      };
      await setDoc(doc(firestore, 'users', user.uid), newUser);
      patchState(store, { currentUser: newUser });
    }

    async function loadAndSetUser(user: User): Promise<void> {
      await setDoc(doc(firestore, 'users', user.uid),
        { lastLoginAt: new Date().toISOString() }, { merge: true });
      const snap = await getDoc(doc(firestore, 'users', user.uid));
      if (snap.exists()) patchState(store, { currentUser: snap.data() as IUser });
    }

    async function run(fn: () => Promise<void>): Promise<void> {
      patchState(store, { isLoading: true, status: 'loading', error: null });
      try {
        await fn();
        patchState(store, { status: 'success' });
      } catch (e: any) {
        const msg = parseError(e.code);
        patchState(store, { error: msg, status: 'error' });
        notify.error(msg);
      } finally {
        patchState(store, { isLoading: false });
      }
    }

    function parseError(code: string): string {
      const map: Record<string, string> = {
        'auth/email-already-in-use': 'Email вже використовується',
        'auth/invalid-email': 'Невірний формат email',
        'auth/wrong-password': 'Невірний пароль',
        'auth/invalid-credential': 'Невірний email або пароль',
        'auth/user-not-found': 'Користувача не знайдено',
        'auth/weak-password': 'Пароль занадто слабкий (мін. 6 символів)',
        'auth/popup-closed-by-user': 'Вікно авторизації закрито',
        'auth/too-many-requests': 'Забагато спроб. Спробуй пізніше',
        'auth/network-exists-with-different-credential': 'Акаунт вже існує з іншим методом входу',
        'auth/network-request-failed': 'Помилка мережі. Перевір підключення',
      };
      return map[code] ?? 'Щось пішло не так. Спробуй ще раз';
    }

    return { init, register, login, loginWithGoogle, loginWithFacebook, loginWithGitHub, logout, updateUser };
  })
);
