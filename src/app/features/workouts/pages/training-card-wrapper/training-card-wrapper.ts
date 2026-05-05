import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {
  TrainingCardDialogComponent
} from '../../components/training-card-dialog-component/training-card-dialog-component';
import {CdkDragHandle} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-training-card-wrapper',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatIconModule, CdkDragHandle],
  templateUrl: 'training-card-wrapper.html',
  styleUrl: 'training-card-wrapper.scss',
})
export class TrainingCardWrapper {
  @Input() progress: number = 90;
  @Input() day: string = '0';
  @Input() title: string = 'Bench';
  @Input() hasIndicator: boolean = true;
  @Input() dayId: string = '';

  @Output() deleteDay = new EventEmitter<void>();
  @Output() editDay = new EventEmitter<void>();
  @Output() tapDay = new EventEmitter<void>();

  private pressTimer: ReturnType<typeof setTimeout> | null = null;
  private isLongPress = false;

  constructor(private dialog: MatDialog) {}

  onPressStart(event: MouseEvent | TouchEvent): void {
    this.isLongPress = false;
    this.pressTimer = setTimeout(() => {
      this.isLongPress = true;
      this.openDialog();
    }, 1000);
  }

  onPressEnd(event: MouseEvent | TouchEvent): void {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }
    if (!this.isLongPress) {
      this.tapDay.emit();
    }
  }

  onPressCancel(): void {
    if (this.pressTimer) {
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }
  }

  openDialog(): void {
    const ref = this.dialog.open(TrainingCardDialogComponent, {
      width: '280px',
      data: { title: this.title, day: this.day },
    });

    ref.afterClosed().subscribe((result: 'edit' | 'delete' | undefined) => {
      if (result === 'edit') this.editDay.emit();
      if (result === 'delete') this.deleteDay.emit();
    });
  }

  getProgressColor(progress: number): string {
    if (progress >= 85) return '#26c6da';
    if (progress >= 75) return '#4db6ac';
    if (progress >= 65) return '#9ccc65';
    if (progress >= 55) return '#d4a574';
    return '#ef5350';
  }
}
