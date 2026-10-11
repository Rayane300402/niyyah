import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ui-button',
  imports: [],
  templateUrl: './ui-button.component.html',
  styleUrl: './ui-button.component.scss'
})
export class UiButtonComponent {
  @Input() variant: 'primary' | 'outline' | 'danger' = 'primary';

  @Input() fullWidth = false;
  @Input() disabled = false;

  @Input() icon?: string;

  @Output() buttonClick = new EventEmitter<void>();
  
}
