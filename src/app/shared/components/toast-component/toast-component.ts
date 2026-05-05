import {Component, inject, signal} from '@angular/core';
import {INotification, NotificationService} from '../../../core/services/notification-service';

@Component({
  selector: 'app-toast-component',
  imports: [],
  templateUrl: './toast-component.html',
  styleUrl: './toast-component.scss',
})
export class ToastComponent {

  notifications = signal<INotification[]>([]);
  private counter = 0;


  protected notify = inject(NotificationService);

  icon(type: INotification['type']): string {
    const icons: Record<INotification['type'], string> = {
      success: '✅',
      error: '❌',
      info: 'ℹ️',
      warning: '⚠️',
    };
    return icons[type];
  }

 /* success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 5000): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration = 4000): void {
    this.show(message, 'warning', duration);
  }

  dismiss(id: number): void {
    this.notifications.update(list => list.filter(n => n.id !== id));
  }

  private show(message: string, type: NotificationType, duration: number): void {
    if (!message?.trim()) return;
    const id = ++this.counter;
    this.notifications.update(list => [...list, { id, message, type }]);
    setTimeout(() => this.dismiss(id), duration);
  }
*/

}
