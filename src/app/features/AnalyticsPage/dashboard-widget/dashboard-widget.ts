import { Component, signal, computed } from '@angular/core';
import {
  MUSCLE_STATS, PR_DATA, MEASURE_DATA, TONNAGE_DATA, FREQ_DATA
} from '../chart.mock';
import { StatCardData } from '../chart.model';
import {StatCardComponent} from '../charts/stat-card-component/stat-card-component';
import {MuscleDonutChartComponent} from '../charts/muscle-donut-chart-component/muscle-donut-chart-component';
import {TonnageChartComponent} from '../charts/tonnage-chart-component/tonnage-chart-component';
import {PRProgressChartComponent} from '../charts/prprogress-chart-component/prprogress-chart-component';
import {BodyMeasureChartComponent} from '../charts/body-measure-chart-component/body-measure-chart-component';

export interface IDashboardWidget {
  id: string;
  label: string;
  icon: string;
  description: string;
  active: boolean;
  fullWidth: boolean;
}
@Component({
  selector: 'app-dashboard-widget',
  standalone: true,
  imports: [
    StatCardComponent,
    MuscleDonutChartComponent,
    TonnageChartComponent,
    PRProgressChartComponent,
    BodyMeasureChartComponent,

  ],
  templateUrl: './dashboard-widget.html',
  styleUrl: './dashboard-widget.scss',
})
export class DashboardWidget {
  editMode = signal(false);

  widgets = signal<IDashboardWidget[]>([
    { id: 'stats',   label: 'Stat Cards',    icon: '📊', description: 'Workouts, tonnage, streak', active: true,  fullWidth: true  },
    { id: 'donut',   label: 'Muscle Groups', icon: '🍩', description: 'Donut chart by muscle',     active: true,  fullWidth: false },
    { id: 'tonnage', label: 'Tonnage',       icon: '🏋️', description: 'Weekly bar chart',          active: true,  fullWidth: false },
    { id: 'pr',      label: 'PR Progress',   icon: '💪', description: 'Personal record line',      active: false, fullWidth: true  },
    { id: 'body',    label: 'Body Measure',  icon: '⚖️', description: 'Weight / measurements',     active: false, fullWidth: false },
    { id: 'freq',    label: 'Workout Freq',  icon: '📅', description: 'Sessions per week',         active: false, fullWidth: false },
  ]);

  activeWidgets = computed(() => this.widgets().filter(w => w.active));

  // Data
  muscleStats = signal(MUSCLE_STATS);
  prData = signal(PR_DATA);
  measureData = signal(MEASURE_DATA);
  tonnageData = signal(TONNAGE_DATA);
  freqData = signal(FREQ_DATA);

  statCards = signal<StatCardData[]>([
    { label: 'Workouts / month', value: '18',     delta: '+3 vs last month', deltaPositive: true,  color: '#26c6da', sparkline: [10,12,11,14,13,15,16,18] },
    { label: 'Total tonnage',    value: '121т',   delta: '+8.4т',            deltaPositive: true,  color: '#7E57C2', sparkline: [80,90,85,95,100,105,110,121] },
    { label: 'Best streak',      value: '12 days',delta: '−2 vs best',       deltaPositive: false, color: '#FFA726', sparkline: [5,7,8,10,12,11,12,10] },
    { label: 'Avg session',      value: '68 min', delta: '+5 min',           deltaPositive: true,  color: '#66BB6A', sparkline: [55,60,58,62,65,63,68,68] },
  ]);

  prExercises = [
    { id: '0009', name: 'Chest Fly',   color: '#42A5F5' },
    { id: '0042', name: 'EZ-bar Curl', color: '#7E57C2' },
  ];

  toggleEdit(): void {
    this.editMode.update(v => !v);
  }

  toggleWidget(id: string): void {
    this.widgets.update(list =>
      list.map(w => w.id === id ? { ...w, active: !w.active } : w)
    );
  }

  isActive(id: string): boolean {
    return this.widgets().find(w => w.id === id)?.active ?? false;
  }
}
