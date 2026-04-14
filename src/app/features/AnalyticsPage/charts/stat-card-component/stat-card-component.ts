import { Component, computed, input } from '@angular/core';
import { StatCardData } from '../../chart.model';

@Component({
  selector: 'app-stat-card-component',
  imports: [],
  standalone: true,
  templateUrl: './stat-card-component.html',
  styleUrl: './stat-card-component.scss',
})
export class StatCardComponent {
  data = input.required<StatCardData>();

  sparklinePath = computed(() => {
    const vals = this.data().sparkline;
    if (!vals.length) return '';
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const w = 80, h = 28;
    return vals.map((v, i) => {
      const x = (i / (vals.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  });
}
