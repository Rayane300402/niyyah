import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fasting-status',
  imports: [],
  templateUrl: './fasting-status.component.html',
  styleUrl: './fasting-status.component.scss'
})
export class FastingStatusComponent {
  @Input({ required: true }) isFasting: boolean = false;
}
