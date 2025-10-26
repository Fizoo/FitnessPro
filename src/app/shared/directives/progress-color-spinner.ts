import {Directive, effect, ElementRef, inject, input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appProgressColorSpinner]',
  standalone: true
})
export class ProgressColorSpinnerDirective {
  progress = input.required<number>({ alias: 'appProgressColorSpinner' });

  private readonly el = inject(ElementRef);
  private readonly r2 = inject(Renderer2);

  private readonly COLOR_MAP = [
    { threshold: 85, color: '#26c6da' }, // Bright Cyan
    { threshold: 75, color: '#4db6ac' }, // Teal
    { threshold: 65, color: '#9ccc65' }, // Light Green
    { threshold: 55, color: '#d4a574' }, // Gold
    { threshold: 0, color: '#ef5350' }   // Red
  ] as const;

  constructor() {
    // Effect автоматично відслідковує зміни signal
    effect(() => {
      const color = this.getColorByProgress(this.progress());
      this.applyColor(color);
    });
  }
  private getColorByProgress(progress: number): string {
    return this.COLOR_MAP.find(({ threshold }) => progress >= threshold)!.color;
  }
  private applyColor(color: string): void {
    const element = this.el.nativeElement;
    this.r2.setStyle(element, 'color', color);
    this.r2.setStyle(element, '--progress-color', color);
  }

}
