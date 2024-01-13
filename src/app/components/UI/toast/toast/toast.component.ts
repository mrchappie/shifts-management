import {
  ChangeDetectorRef,
  Component,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ToastService } from 'src/app/utils/services/toast/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  @Input() toast!: Toast;
  @Input() index!: number;

  constructor(public toastService: ToastService, private renderer: Renderer2) {}

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
