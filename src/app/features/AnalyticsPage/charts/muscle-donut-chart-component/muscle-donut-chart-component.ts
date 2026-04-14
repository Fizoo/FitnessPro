import {Component, computed, input, signal} from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartPeriod, MuscleGroupStat } from '../../chart.model'
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-muscle-donut-chart-component',
  imports: [BaseChartDirective, TitleCasePipe],
  templateUrl: './muscle-donut-chart-component.html',
  styleUrl: './muscle-donut-chart-component.scss',
  standalone: true,
})
export class MuscleDonutChartComponent {
  data = input.required<MuscleGroupStat[]>();

  period = signal<ChartPeriod>('month');
  readonly periods: ChartPeriod[] = ['last', 'week', 'month', 'all'];

  chartData = computed<ChartData<'doughnut'>>(() => ({
    labels: this.data().map(d => d.label),
    datasets: [{
      data: this.data().map(d => d.value),
      backgroundColor: this.data().map(d => d.color),
      borderColor: '#050607',
      borderWidth: 3,
      hoverOffset: 8,
    }]
  }));

  chartOptions: ChartOptions<'doughnut'> = {
    cutout: '68%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` ${ctx.label}: ${ctx.parsed}%`
        }
      }
    }
  };
}
