import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'intro',
  },
  {
    path: 'intro',
    loadComponent: () =>
      import('./features/intro/intro-page.component').then(
        (m) => m.IntroPageComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/app-shell/app-shell.component').then(
        (m) => m.AppShellComponent
      ),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home-page.component').then(
            (m) => m.HomePageComponent
          ),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./features/calendar/calendar-page.component').then(
            (m) => m.CalendarPageComponent
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./features/create/create-page.component').then(
            (m) => m.CreatePageComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile-page.component').then(
            (m) => m.ProfilePageComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'intro',
  },
];