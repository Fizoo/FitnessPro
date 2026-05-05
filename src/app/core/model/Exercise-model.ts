export interface IExercise {
  id: string;
  name: string;
  gifUrl: string;
  staticImageUrl?: string;
  bodyPart: string;
  target: string;
  equipment: string;
  secondaryMuscles: string[];
  instructions: string[];
  description: string;
  difficulty: Difficulty;
  category: Category;
  isFavorite: boolean,
  personalRecord?:null|any,
  history?:any
}

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Category = 'strength' | 'cardio' | 'mobility' | 'balance' | 'stretching' | 'plyometrics' | 'rehabilitation';

export interface IMuscleGroup {
  id: number;
  name: string;
  exerciseCount: number;
  imageUrl: string;
}
export interface IBody {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  secondaryMuscles: string[];
  instructions: string[];
  description: string;
  difficulty: string;
  category: string;
}

export interface IPersonalRecord {
  exerciseId: string;
  weight: number;
  reps: number;
  date: string;
}



export interface IWorkoutHistory {
  id: string;
  date: string;
  dayId: number;
  programId: string;
  duration: number; // хвилини
  exercises: {
    exerciseId: string;
    sets: IExerciseSet[];
  }[];
}
// Один підхід
export interface IExerciseSet {
  setNum: number;
  weight: number;
  reps: number;
  time: string;        // "16:55"
  comment?: string;    // коментар на підхід
}

// Одна сесія по одній вправі (один день)
export interface IExerciseSession {
  id: string;          // auto-id від Firestore
  exerciseId: string;  // "0007"
  bodyPart: string;    // "back" — щоб дістати вправу якщо треба
  date: string;        // "2026-03-03" — для групування по даті
  comment?: string;    // коментар на всю сесію
  sets: IExerciseSet[];
}
export interface IData {
  name: string,
  data: IExercise[],
  id: number,
  exerciseCount: number
  imageUrl: string,
  params: string
}
