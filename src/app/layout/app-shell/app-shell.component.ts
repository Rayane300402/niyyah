import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FloatingNavComponent } from '../../features/shared/floating-nav/floating-nav.component';

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [RouterOutlet, FloatingNavComponent],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {}