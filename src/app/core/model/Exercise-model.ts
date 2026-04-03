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
  personalRecord: number|  null,
  history: string[]
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
