import { Component } from '@angular/core';
import { PageHeaderComponent } from '../shared/page-header/page-header.component';
import { CurrentTimeComponent } from './components/current-time/current-time.component';
@Component({
  selector: 'app-home-page',
  imports: [PageHeaderComponent, CurrentTimeComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
