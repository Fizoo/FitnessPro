import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'progressColor', standalone: true})
export class ProgressColorPipe implements PipeTransform {
  transform(progress: number): string {
    if (progress >= 85) return '#26c6da';
    if (progress >= 75) return '#4db6ac';
    if (progress >= 65) return '#9ccc65';
    if (progress >= 55) return '#d4a574';
    return '#ef5350';
  }

}
