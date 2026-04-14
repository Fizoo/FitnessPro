import { Component, computed, input, signal } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { GroupBy } from '../../chart.model';

@Component({
  selector: 'app-tonnage-chart-component',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './tonnage-chart-component.html',
  styleUrl: './tonnage-chart-component.scss',
})
export class TonnageChartComponent {
  labels = input.required<string[]>();
  values = input.required<number[]>();

  groupBy = signal<GroupBy>('week');

  chartData = computed<ChartData<'bar'>>(() => ({
    labels: this.labels(),
    datasets: [{
      data: this.values(),
      backgroundColor: '#26c6da33',
      borderColor: '#26c6da',
      borderWidth: 1.5,
      borderRadius: 6,
      borderSkipped: false,
      hoverBackgroundColor: '#26c6da55',
    }]
  }));

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` ${((ctx.parsed?.y ?? 0) / 1000).toFixed(1)}т`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9e9e9e', font: { size: 11 } },
        border: { color: '#1e2a2a' }
      },
      y: {
        grid: { color: '#1e2a2a' },
        ticks: {
          color: '#9e9e9e',
          font: { size: 11 },
          callback: val => `${(+(val ?? 0) / 1000).toFixed(0)}т`
        },
        border: { display: false }
      }
    }
  };

  totalTonnage = computed(() => this.values().reduce((a, b) => a + b, 0));
}
