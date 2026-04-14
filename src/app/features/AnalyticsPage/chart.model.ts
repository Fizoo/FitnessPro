export type ChartPeriod = 'last' | 'week' | 'month' | 'all';
export type MeasureType =
  | 'chest' | 'back' | 'shoulders'
  | 'triceps' | 'biceps' | 'leg'
  | 'wrist' | 'waist' | 'hip' | 'weight';
export type GroupBy = 'week' | 'month';

export interface MuscleGroupStat {
  label: string;
  value: number;
  color: string;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface StatCardData {
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  sparkline: number[];
  color: string;
}
