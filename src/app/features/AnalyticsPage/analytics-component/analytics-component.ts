import {Component, computed, inject, signal} from '@angular/core';


import {
  MUSCLE_STATS, PR_DATA, MEASURE_DATA, TONNAGE_DATA, FREQ_DATA
} from '../chart.mock';
import { MeasureType, StatCardData } from '../chart.model';
import {StatCardComponent} from '../charts/stat-card-component/stat-card-component';
import {MuscleDonutChartComponent} from '../charts/muscle-donut-chart-component/muscle-donut-chart-component';
import {TonnageChartComponent} from '../charts/tonnage-chart-component/tonnage-chart-component';
import {PRProgressChartComponent} from '../charts/prprogress-chart-component/prprogress-chart-component';
import {BodyMeasureChartComponent} from '../charts/body-measure-chart-component/body-measure-chart-component';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
@Component({
  selector: 'app-analytics-component',
  imports: [
    StatCardComponent,
    MuscleDonutChartComponent,
    TonnageChartComponent,
    PRProgressChartComponent,
    BodyMeasureChartComponent,

  ],
  templateUrl: './analytics-component.html',
  styleUrl: './analytics-component.scss',
})
export class AnalyticsComponent {
  muscleStats = signal(MUSCLE_STATS);
  prData = signal(PR_DATA);
  measureData = signal(MEASURE_DATA);
  tonnageData = signal(TONNAGE_DATA);
  freqData = signal(FREQ_DATA);
  location=inject(Location)
  router=inject(Router)


  // Stat cards
  statCards = signal<StatCardData[]>([
    { label: 'Workouts / month', value: '18',     delta: '+3 vs last month',  deltaPositive: true,  color: '#26c6da', sparkline: [10,12,11,14,13,15,16,18] },
    { label: 'Total tonnage',    value: '121т',   delta: '+8.4т vs last month', deltaPositive: true,  color: '#7E57C2', sparkline: [80,90,85,95,100,105,110,121] },
    { label: 'Best streak',      value: '12 days',delta: '−2 vs best',        deltaPositive: false, color: '#FFA726', sparkline: [5,7,8,10,12,11,12,10] },
    { label: 'Avg session',      value: '68 min', delta: '+5 min',            deltaPositive: true,  color: '#66BB6A', sparkline: [55,60,58,62,65,63,68,68] },
  ]);

  // PR exercises
  prExercises = [
    { id: '0009',    name: 'Chest Fly',   color: '#42A5F5' },
    { id: '0042',    name: 'EZ-bar Curl', color: '#7E57C2' },
    { id: 'squat',   name: 'Squat',       color: '#66BB6A' },
    { id: 'deadlift',name: 'Deadlift',    color: '#EF5350' },
  ];

  // Body measures
  readonly measures: { key: MeasureType; label: string; unit: string }[] = [
    { key: 'weight',    label: 'Вага',   unit: 'kg' },
    { key: 'chest',     label: 'Грудь',  unit: 'cm' },
    { key: 'back',      label: 'Спина',  unit: 'cm' },
    { key: 'shoulders', label: 'Плечі',  unit: 'cm' },
    { key: 'biceps',    label: 'Биц',    unit: 'cm' },
    { key: 'triceps',   label: 'Триц',   unit: 'cm' },
    { key: 'leg',       label: 'Нога',   unit: 'cm' },
    { key: 'wrist',     label: 'Кисть',  unit: 'cm' },
    { key: 'waist',     label: 'Талія',  unit: 'cm' },
    { key: 'hip',       label: 'Ж',      unit: 'cm' },
  ];

  activePR = signal(this.prExercises[0].id);

  activePRMeta = computed(() =>
    this.prExercises.find(e => e.id === this.activePR())!
  );

  activeMeasure = signal<MeasureType>('weight');

  activeMeasureMeta = computed(() =>
    this.measures.find(m => m.key === this.activeMeasure())!
  );

  // Active tab for tonnage/freq
  activeWorkoutTab = signal<'tonnage' | 'freq'>('tonnage');

  protected onBack() {
    this.location.back();
  }

  protected onMain() {
    this.router.navigate(['/dashboard'])
  }
}
