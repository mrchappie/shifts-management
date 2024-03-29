import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() confirmButtonMessage: string = '';
  @Input() cancelButtonMessage: string = '';

  @Output() confirmModalEvent = new EventEmitter<Event>();
  @Output() closeModalEvent = new EventEmitter<Event>();

  closeModal(event: Event) {
    event.stopPropagation();
    this.closeModalEvent.emit();
  }

  confirmModal(event: Event) {
    event.stopPropagation();
    this.confirmModalEvent.emit(event);
  }
}
