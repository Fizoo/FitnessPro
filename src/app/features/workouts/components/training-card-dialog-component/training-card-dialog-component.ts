import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface TrainingCardDialogData {
  title: string;
  day: string;
}

@Component({
  selector: 'app-training-card-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: 'training-card-dialog-component.html',
  styleUrl: 'training-card-dialog-component.scss',
})
export class TrainingCardDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TrainingCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TrainingCardDialogData
  ) {}

  close(result: 'edit' | 'delete'): void {
    this.dialogRef.close(result);
  }
}
