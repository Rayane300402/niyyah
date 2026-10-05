import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-floating-nav',
  standalone: true,
  imports: [],
  templateUrl: './floating-nav.component.html',
  styleUrl: './floating-nav.component.scss'
})
export class FloatingNavComponent {
  isOpen = signal(false);

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.isOpen.update(value => !value);
    console.log('nav clicked', this.isOpen());
  }

  navigateTo(route: string): void {
    this.isOpen.set(false);
    this.router.navigate([route]);
  }
}