import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from 'src/app/utils/services/toast/toast.service';

@Component({
  standalone: true,
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  imports: [NgClass, MatIconModule, TitleCasePipe],
})
export class ToastComponent {
  @Input() toast!: Toast;
  @Input() index!: number;

  constructor(public toastService: ToastService) {}

  closeToast(event: Event, index: number) {
    event.stopPropagation();
    console.log('Closed', index);
    this.toastService.remove(index);
  }
}

interface Toast {
  type: string;
  message: string;
  delay: number;
}
