import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiButtonComponent } from '../ui-button/ui-button.component';

@Component({
  selector: 'app-modal',
  imports: [UiButtonComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() isOpen = false;

  @Input() title = '';
  @Input() message = '';

  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
