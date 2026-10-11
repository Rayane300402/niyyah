import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';

@Component({
  selector: 'app-current-time',
  imports: [],
  templateUrl: './current-time.component.html',
  styleUrl: './current-time.component.scss'
})
export class CurrentTimeComponent implements OnInit {

  time = '';
  period = '';

  private destroyRed = inject(DestroyRef);

  ngOnInit(): void {
    timer(0, 60_000)
    .pipe(takeUntilDestroyed(this.destroyRed))
    .subscribe(() => {
      const now = new Date();

      const formattedTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      [this.time, this.period] = formattedTime.split(' ');
    });
  }


}
