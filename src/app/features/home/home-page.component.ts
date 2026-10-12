import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../shared/page-header/page-header.component';
import { CurrentTimeComponent } from './components/current-time/current-time.component';
import { FastingActionComponent } from './components/fasting-action/fasting-action.component';
import { MaghribCountdownComponent } from './components/maghrib-countdown/maghrib-countdown.component';
import { PrayerTimes, PrayerTimesService } from '../../core/api/prayer-times.service';
@Component({
  selector: 'app-home-page',
  imports: [PageHeaderComponent, CurrentTimeComponent, FastingActionComponent, MaghribCountdownComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {

  prayerTimes?: PrayerTimes;

  constructor(private prayerTimesService: PrayerTimesService) {  }

    ngOnInit(): void {
      this.loadPrayerTimes();
    }

    private loadPrayerTimes(): void {
      this.prayerTimesService
      .getTodayPrayerTimes('Tripoli', 'LB')
      .subscribe({
        next: times => {
          this.prayerTimes = times;

          console.log('Prayer tim4es:', times)
        },
        error: error => {
          console.error('Failed to load:', error)
        }
      })
    }

}
