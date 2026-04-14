import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  updateProfile,
  User,
  onAuthStateChanged,
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { IUser } from '../../features/auth/models/user';
import {NotificationService} from './notification-service';

export type AuthStatus = 'idle' | 'loading' | 'success' | 'error';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private firebaseAuth = inject(Auth);
  private firestore = inject(Firestore);

  private notify = inject(NotificationService);

  currentUser = signal<IUser | null>(null);
  isInitialized = signal(false);
  isLoading = signal(false);
  error = signal<string | null>(null);
  status = signal<AuthStatus>('idle'); // ← новий сигнал стану
  successMessage = signal<string | null>(null); // ← повідомлення успіху

  private isRegistering = false; // ← флаг щоб onAuthStateChanged не перебивав реєстрацію

  constructor() {
    onAuthStateChanged(this.firebaseAuth, async (user): Promise<void> => {

      if (this.isRegistering) return; // ← пропускаємо під час реєстрації

      if (user) {
        try {
          const ref = doc(this.firestore, 'users', user.uid);
          const snap = await getDoc(ref);

          if (snap.exists() && snap.data()['email']) {
            this.currentUser.set(snap.data() as IUser);
          } else {
            // документ неповний — відновлюємо
            await this.createUserDoc(user, user.displayName ?? user.email ?? '');
          }
        } catch (e) {
          console.error('onAuthStateChanged Firestore error:', e);
        }
      } else {
        this.currentUser.set(null);
      }
      this.isInitialized.set(true);
    });
  }

  // ─── Email/Password ───────────────────────────────────────────

  async register(email: string, password: string, username: string): Promise<void> {
    await this.run(async (): Promise<void> => {
      this.isRegistering = true; // ← блокуємо onAuthStateChanged
      try {
        const cred = await createUserWithEmailAndPassword(this.firebaseAuth, email, password);
        await updateProfile(cred.user, { displayName: username });
        await this.createUserDoc(cred.user, username);
        this.isInitialized.set(true);
        this.notify.success('Реєстрація успішна! 🎉');
        //this.successMessage.set('Реєстрація успішна! Ласкаво просимо 🎉');
      } finally {
        this.isRegistering = false; // ← розблоковуємо
      }
    });
  }

  async login(email: string, password: string): Promise<void> {
    await this.run(async (): Promise<void> => {
      const cred = await signInWithEmailAndPassword(this.firebaseAuth, email, password);
      await this.loadAndSetUser(cred.user);
      this.notify.success('Вхід успішний! 👋');
      //this.successMessage.set('Вхід успішний! 👋');
    });

  }

  // ─── OAuth ────────────────────────────────────────────────────

  async loginWithGoogle(): Promise<void> {

    await this.loginWithProvider(new GoogleAuthProvider());

  }

  async loginWithFacebook(): Promise<void> {
    await this.loginWithProvider(new FacebookAuthProvider());
  }

  async loginWithGitHub(): Promise<void> {
    await this.loginWithProvider(new GithubAuthProvider());
  }

  // ─── Logout ───────────────────────────────────────────────────

  async logout(): Promise<void> {
    await this.run(async (): Promise<void> => {
      await signOut(this.firebaseAuth);
      this.currentUser.set(null);
      this.notify.success('До побачення! 👋');
     // this.successMessage.set(null);
    });
  }

  // ─── Private ──────────────────────────────────────────────────

  private async loginWithProvider(
    provider: GoogleAuthProvider | FacebookAuthProvider | GithubAuthProvider
  ): Promise<void> {
    await this.run(async (): Promise<void> => {
      const cred = await signInWithPopup(this.firebaseAuth, provider);
      const ref = doc(this.firestore, 'users', cred.user.uid);
      const snap = await getDoc(ref);

      if (snap.exists() && snap.data()['email']) {
        await this.updateLastLogin(cred.user);
      } else {
        await this.createUserDoc(cred.user, cred.user.displayName ?? '');
      }
      this.successMessage.set('Вхід успішний! 👋');
    });
  }

  private async createUserDoc(user: User, username: string): Promise<void> {
    const newUser: IUser = {
      uid: user.uid,
      email: user.email ?? '',
      displayName: username,
      photoURL: user.photoURL ?? '',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      age: null,          // ← undefined → null
      gender: null,       // ← undefined → null
      height: null,       // ← undefined → null
      weight: null,       // ← undefined → null
      fitnessGoal: null,  // ← undefined → null
      activeProgramId: null, // ← undefined → null
      settings: {
        weightUnit: 'kg',
        language: 'uk',
        notifications: true,
        theme: 'dark',
      },
    };
    await setDoc(doc(this.firestore, 'users', user.uid), newUser);
    this.currentUser.set(newUser);
  }

  private async loadAndSetUser(user: User): Promise<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    await setDoc(ref, { lastLoginAt: new Date().toISOString() }, { merge: true });
    const snap = await getDoc(ref);
    if (snap.exists()) this.currentUser.set(snap.data() as IUser);
  }

  private async updateLastLogin(user: User): Promise<void> {
    await this.loadAndSetUser(user);
  }

  private async run(fn: () => Promise<void>): Promise<void> {
    this.isLoading.set(true);
    this.status.set('loading');
    this.error.set(null);
    this.successMessage.set(null);
   // this.notify.success('Реєстрація успішна! 🎉');
   // this.notify.success('Вхід успішний! 👋');
    try {
      await fn();
      this.status.set('success');
    } catch (e: any) {
      console.error('AUTH ERROR code:', e.code);
      console.error('AUTH ERROR message:', e.message);
      console.error('AUTH ERROR full:', e);  // ← додай це
      this.error.set(this.parseError(e.code));
      this.notify.error(this.parseError(e.code));
      this.status.set('error');
    } finally {
      this.isLoading.set(false);
    }
  }

  private parseError(code: string): string {
    const map: Record<string, string> = {
      'auth/email-already-in-use': 'Email вже використовується',
      'auth/invalid-email': 'Невірний формат email',
      'auth/wrong-password': 'Невірний пароль',
      'auth/invalid-credential': 'Невірний email або пароль',
      'auth/user-not-found': 'Користувача не знайдено',
      'auth/weak-password': 'Пароль занадто слабкий (мін. 6 символів)',
      'auth/popup-closed-by-user': 'Вікно авторизації закрито',
      'auth/too-many-requests': 'Забагато спроб. Спробуй пізніше',
      'auth/account-exists-with-different-credential': 'Акаунт вже існує з іншим методом входу',
      'auth/network-request-failed': 'Помилка мережі. Перевір підключення',
      'auth/operation-not-allowed': 'Цей метод входу не увімкнений',
    };
    return map[code] ?? 'Щось пішло не так. Спробуй ще раз';
  }
}
