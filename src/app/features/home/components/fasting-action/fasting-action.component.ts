import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiButtonComponent } from '../../../shared/ui-button/ui-button.component';
import { ModalComponent } from '../../../shared/modal/modal.component';

@Component({
  selector: 'app-fasting-action',
  imports: [UiButtonComponent, ModalComponent],
  templateUrl: './fasting-action.component.html',
  styleUrl: './fasting-action.component.scss'
})
export class FastingActionComponent {
  @Input() isFasting = false;

  @Output() isFastingChange = new EventEmitter<boolean>();

  isConfirmationOpen = false;

  openConfirmation(): void {
    this.isConfirmationOpen = true;
  }

  closeConfirmation(): void {
    this.isConfirmationOpen = false;
  }

  confirmAction(): void {
    this.isFasting
      ? this.confirmEndFast()
      : this.confirmStartFast();
  }

  confirmStartFast(): void {
    this.isConfirmationOpen = false;
    this.isFastingChange.emit(true);

    //TODO: Fasting logic
  }

  confirmEndFast(): void {
    this.isConfirmationOpen = false;
    this.isFastingChange.emit(false);
  }
}
