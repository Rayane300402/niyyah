import { Component } from '@angular/core';
import { PageHeaderComponent } from '../shared/page-header/page-header.component';
import { CurrentTimeComponent } from './components/current-time/current-time.component';
import { FastingActionComponent } from './components/fasting-action/fasting-action.component';
import { MaghribCountdownComponent } from './components/maghrib-countdown/maghrib-countdown.component';
@Component({
  selector: 'app-home-page',
  imports: [PageHeaderComponent, CurrentTimeComponent, FastingActionComponent, MaghribCountdownComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  fajrTime = new Date();
  maghribTime = new Date();

  constructor() {
    this.fajrTime.setHours(5, 15, 0, 0);
    this.maghribTime.setHours(18, 20, 0, 0);
  }
}
