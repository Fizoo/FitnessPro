export interface IUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: string;
  lastLoginAt: string;
  age: number | null;        // ← не undefined
  gender: string | null;     // ← не undefined
  height: number | null;     // ← не undefined
  weight: number | null;     // ← не undefined
  fitnessGoal: string | null; // ← не undefined
  activeProgramId: string | null; // ← не undefined
  settings: {
    weightUnit: 'kg' | 'lbs';
    language: string;
    notifications: boolean;
    theme: 'dark' | 'light';
  };
}
