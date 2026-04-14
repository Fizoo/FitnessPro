import {Component, computed, input} from '@angular/core';
import {ChartData, ChartOptions} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';
import {MeasureType, TimeSeriesPoint} from '../../chart.model';


const MEASURE_COLORS: Record<string, string> = {
  chest: '#42A5F5', biceps: '#7E57C2', waist: '#EF5350',
  hips: '#FFA726', thigh: '#26A69A', weight: '#66BB6A',
};

const MEASURE_LABELS: Record<string, string> = {
  chest: 'Chest', biceps: 'Biceps', waist: 'Waist',
  hips: 'Hips', thigh: 'Thigh', weight: 'Body Weight',
};

@Component({
  selector: 'app-body-measure-chart-component',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './body-measure-chart-component.html',
  styleUrl: './body-measure-chart-component.scss',
})
export class BodyMeasureChartComponent {
  measureType = input.required<MeasureType>();
  data = input.required<TimeSeriesPoint[]>();
  unit = input<string>('cm');

  color = computed(() => MEASURE_COLORS[this.measureType()] ?? '#26c6da');
  label = computed(() => MEASURE_LABELS[this.measureType()] ?? this.measureType());

  currentValue = computed(() => this.data().at(-1)?.value ?? 0);
  delta = computed(() => {
    const d = this.data();
    if (d.length < 2) return 0;
    return +(d.at(-1)!.value - d.at(-2)!.value).toFixed(1);
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
    plugins: { legend: { display: false } },
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
