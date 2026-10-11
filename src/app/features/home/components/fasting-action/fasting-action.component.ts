import { Component } from '@angular/core';
import { UiButtonComponent } from '../../../shared/ui-button/ui-button.component';
import { ModalComponent } from '../../../shared/modal/modal.component';

@Component({
  selector: 'app-fasting-action',
  imports: [UiButtonComponent, ModalComponent],
  templateUrl: './fasting-action.component.html',
  styleUrl: './fasting-action.component.scss'
})
export class FastingActionComponent {
  isConfirmationOpen = false;
  isFastingUi = false;

  openConfirmation(): void {
    this.isConfirmationOpen = true;
  }

  closeConfirmation(): void {
    this.isConfirmationOpen = false;
  }

  confirmStartFast(): void {
    this.isConfirmationOpen = false;
    this.isFastingUi = true;

    //TODO: Fasting logic
  }

  confirmEndFast(): void {
    this.isConfirmationOpen = false;
    this.isFastingUi = false;
  }
}
