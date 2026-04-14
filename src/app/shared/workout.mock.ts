export interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  progress: number; // 0-100
}

export interface WorkoutDay {
  id: number;
  title: string;
  progress: number;
  exercises: WorkoutExercise[];
}

export const WORKOUT_DAYS: WorkoutDay[] = [
  {
    id: 1, title: 'Bench', progress: 90,
    exercises: [
      { id: '0009', name: 'Chest Fly',            sets: 4, reps: 14, weight: 95,   progress: 75 },
      { id: '0042', name: 'Barbell Deadlift',      sets: 4, reps: 14, weight: 92.5, progress: 68 },
      { id: '0080', name: 'Seated Leg Extensions', sets: 3, reps: 18, weight: 35,   progress: 0  },
      { id: '0190', name: 'Prone Leg Curl',        sets: 3, reps: 18, weight: 35,   progress: 0  },
      { id: '0250', name: 'Triceps Extension',     sets: 3, reps: 12, weight: 20,   progress: 100},
    ]
  },
  {
    id: 2, title: 'Bench', progress: 80,
    exercises: [
      { id: '0009', name: 'Chest Fly',        sets: 4, reps: 12, weight: 80, progress: 60 },
      { id: '0042', name: 'EZ-bar Curl',      sets: 3, reps: 15, weight: 25, progress: 80 },
      { id: '0080', name: 'Shoulder Press',   sets: 4, reps: 10, weight: 50, progress: 100},
    ]
  },
  {
    id: 3, title: 'Bench', progress: 70,
    exercises: [
      { id: '0190', name: 'Squat',            sets: 5, reps: 10, weight: 100, progress: 50 },
      { id: '0250', name: 'Leg Press',        sets: 4, reps: 12, weight: 120, progress: 70 },
      { id: '0009', name: 'Calf Raises',      sets: 3, reps: 20, weight: 60,  progress: 0  },
    ]
  },
  { id: 4, title: 'Bench', progress: 60, exercises: [] },
  { id: 5, title: 'Bench', progress: 50, exercises: [] },
];
