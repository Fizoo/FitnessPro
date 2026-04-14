import { IWorkoutProgram } from './workout-program.models';

export const MOCK_PROGRAM: IWorkoutProgram = {
  id: 'prog-1',
  name: 'Програма квітень 2026',
  month: 3,
  year: 2026,
  createdAt: '2026-04-01',
  weeks: [
    {
      weekNumber: 1,
      days: [
        {
          id: 'day-1-1',
          name: 'Chest & Biceps',
          exercises: [
            { exerciseId: '0009', sets: [{ weight: 90, reps: 8 }, { weight: 90, reps: 8 }, { weight: 90, reps: 8 }] },
            { exerciseId: '0042', sets: [{ weight: 30, reps: 12 }, { weight: 30, reps: 12 }, { weight: 30, reps: 12 }] },
            { exerciseId: '0017', sets: [{ weight: 14, reps: 15 }, { weight: 14, reps: 15 }, { weight: 14, reps: 15 }] },
            { exerciseId: '0033', sets: [{ weight: 0, reps: 20 }, { weight: 0, reps: 20 }, { weight: 0, reps: 20 }] },
          ]
        },
        {
          id: 'day-1-2',
          name: 'Shoulders & Arms',
          exercises: [
            { exerciseId: '0055', sets: [{ weight: 50, reps: 12 }, { weight: 50, reps: 12 }, { weight: 50, reps: 12 }] },
            { exerciseId: '0071', sets: [{ weight: 0, reps: 10 }, { weight: 0, reps: 10 }, { weight: 0, reps: 10 }] },
            { exerciseId: '0088', sets: [{ weight: 40, reps: 15 }, { weight: 40, reps: 15 }, { weight: 40, reps: 15 }] },
          ]
        }
      ]
    },
    {
      weekNumber: 2,
      days: [
        {
          id: 'day-2-1',
          name: 'Chest & Biceps',
          exercises: [
            { exerciseId: '0009', sets: [{ weight: 95, reps: 8 }, { weight: 95, reps: 8 }, { weight: 95, reps: 8 }] },
            { exerciseId: '0042', sets: [{ weight: 32, reps: 12 }, { weight: 32, reps: 12 }, { weight: 32, reps: 12 }] },
          ]
        }
      ]
    },
    { weekNumber: 3, days: [] },
    { weekNumber: 4, days: [] },
  ]
};
