import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, Input, Renderer2 } from '@angular/core';
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

  constructor(public toastService: ToastService, private renderer: Renderer2) {}

  closeToast(event: Event, index: number) {
    event.stopPropagation();

    //add the removeToast animation
    this.renderer.removeClass(event.currentTarget, 'animation-show');
    this.renderer.addClass(event.currentTarget, 'animation-hide');
    setTimeout(() => {
      this.toastService.remove(index);
    }, 300);
  }
}

interface Toast {
  type: string;
  message: string;
  delay: number;
}
