import {Component, computed, input} from '@angular/core';
import {ChartData, ChartOptions} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';
import {TimeSeriesPoint} from '../../chart.model';

@Component({
  selector: 'app-prprogress-chart-component',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './prprogress-chart-component.html',
  styleUrl: './prprogress-chart-component.scss',
})
export class PRProgressChartComponent {
  exerciseName = input<string>('Exercise');
  data = input.required<TimeSeriesPoint[]>();
  color = input<string>('#7E57C2');
  unit = input<string>('kg');

  currentValue = computed(() => this.data().at(-1)?.value ?? 0);
  delta = computed(() => {
    const d = this.data();
    if (d.length < 2) return 0;
    return +(d.at(-1)!.value - d[0].value).toFixed(1);
  });

  chartData = computed<ChartData<'line'>>(() => ({
    labels: this.data().map(d => d.date),
    datasets: [{
      data: this.data().map(d => d.value),
      borderColor: this.color(),
      backgroundColor: this.color() + '22',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: this.color(),
      pointRadius: 5,
      pointHoverRadius: 7,
    }]
  }));

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` ${ctx.parsed.y} ${this.unit()}`
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
        ticks: { color: '#9e9e9e', font: { size: 11 } },
        border: { display: false }
      }
    }
  };
}
