import { AfterViewInit, Component, DestroyRef, ElementRef, inject, Input, NgZone, ViewChild } from '@angular/core';

@Component({
  selector: 'app-maghrib-countdown',
  imports: [],
  templateUrl: './maghrib-countdown.component.html',
  styleUrl: './maghrib-countdown.component.scss'
})
export class MaghribCountdownComponent implements AfterViewInit {
  @Input({ required: true }) fajrTime!: Date;
  @Input({ required: true }) maghribTime!: Date;

  @ViewChild('progressCircle')
  progressCircle!: ElementRef<SVGCircleElement>;

  remainingTime = '00:00:00';

  private readonly destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);

  private animationFrameId?: number;
  private previousSecond = -1;

  private readonly radius = 120;
  private readonly circumference = 2 * Math.PI * this.radius;

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });

    this.destroyRef.onDestroy(() => {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
    });
  }

  private animate = (): void => {
    const now = Date.now();

    const fajr = this.fajrTime.getTime();
    const maghrib = this.maghribTime.getTime();

    const totalDuration = maghrib - fajr;
    const remaining = Math.max(maghrib - now, 0);

    const elapsed = Math.max(now - fajr, 0);

    const progress = Math.min(
      Math.max(elapsed / totalDuration, 0),
      1
    );

    this.updateRing(progress);
    this.updateCountdown(remaining);

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private updateRing(progress: number): void {
    const offset =
      this.circumference - (progress * this.circumference);

    this.progressCircle.nativeElement.style.strokeDashoffset =
      `${offset}`;
  }

  private updateCountdown(remainingMs: number): void {
    const currentSecond = Math.floor(remainingMs / 1000);

    if (currentSecond === this.previousSecond) {
      return;
    }

    this.previousSecond = currentSecond;

    const hours = Math.floor(currentSecond / 3600);
    const minutes = Math.floor((currentSecond % 3600) / 60);
    const seconds = currentSecond % 60;

    const formatted =
      `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;

    this.ngZone.run(()  => {
      this.remainingTime = formatted;
    });
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

}
