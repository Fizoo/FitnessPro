import {Component, input, output} from '@angular/core';

type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
    selector: 'app-alert',
    imports: [],
    templateUrl: './alert.html',
    standalone: true,
    styleUrl: './alert.scss'
})
export class Alert {

  type = input<AlertType>('info');
  message = input.required<string>();
  showAction = input<boolean>(false);
  actionText = input<string>('OK');
  action = output<void>();

  getIcon(): string {
    const icons = {
      success: '✓',
      error: '⚠️',
      warning: '⚡',
      info: 'ℹ️'
    };
    return icons[this.type()];
  }
}
