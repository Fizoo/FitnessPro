export interface ISetPlan {
  weight: number;
  reps: number;
}

export interface IExercisePlan {
  exerciseId: string;
  sets: ISetPlan[];
  percentOfPR?: number;
  notes?: string;
}

export interface IWorkoutDay {
  id: string;
  name: string;
  exercises: IExercisePlan[];
}

export interface IWorkoutWeek {
  weekNumber: number;
  days: IWorkoutDay[];
}

export interface IWorkoutProgram {
  id: string;
  name: string;
  month: number;
  year: number;
  weeks: IWorkoutWeek[];
  createdAt: string;
}
