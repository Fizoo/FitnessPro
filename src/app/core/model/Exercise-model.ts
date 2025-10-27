export interface IExercise {
  id: string;
  name: string;
  gifUrl: string;
  bodyPart: string;
  equipment: string;
  target: string;
  secondaryMuscles?: string[];
  instructions?: string[];
}

export interface IMuscleGroup {
  id: string;
  name: string;
  exerciseCount: number;
  imageUrl: string;
}
