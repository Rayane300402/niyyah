import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { gsap } from 'gsap';
@Component({
  selector: 'app-intro-page',
  standalone: true,
  imports: [],
  templateUrl: './intro-page.component.html',
  styleUrl: './intro-page.component.scss'
})
export class IntroPageComponent implements AfterViewInit {

  @ViewChild('backgroundPattern')
  backgroundPattern!: ElementRef<HTMLImageElement>;

  @ViewChild('patternCurtain')
  patternCurtain!: ElementRef<HTMLImageElement>;

  @ViewChild('logo')
  logo!: ElementRef<HTMLImageElement>;

  @ViewChild('tagline')
  tagline!: ElementRef<HTMLImageElement>;

  constructor(private router:Router) {}

  ngAfterViewInit(): void {
    this.playIntro();
  }

  private playIntro(): void {
    const timeline = gsap.timeline({
      onComplete: () => {
        this.finishIntro();
      }
    });

    timeline
      // Pattern sweep upwards animation
      .fromTo(
        this.backgroundPattern.nativeElement,
        {
          opacity: 0.2
        },
        {
          opacity: 0.2,
          duration: 2,
          ease: 'power2.out'
        }
      )

      .fromTo(
        this.patternCurtain.nativeElement, {
          xPercent:0,
          yPercent:0 
        }, 
        {
          xPercent: 0,
          yPercent: -100,
          duration: 2,
          ease: 'power2.out'
        }
      )

      .fromTo(
        this.logo.nativeElement,
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out'
        },
        '-=0.35'
      )

      .fromTo(
        this.tagline.nativeElement,
        {
          opacity: 0,
          y: 12
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'power2.out'
        },
        '-=0.3'
      )

  }

  private async finishIntro(): Promise<void> {
    // TODO: REMOVE AFTER SETTING UP APP STORE INIT
    await this.wait(500);

    await this.router.navigate(['home']);
  }

  private wait(ms:number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms) );
  }

}
