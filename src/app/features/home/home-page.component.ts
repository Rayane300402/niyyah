import { Component } from '@angular/core';
import { PageHeaderComponent } from '../shared/page-header/page-header.component';
import { CurrentTimeComponent } from './components/current-time/current-time.component';
import { FastingActionComponent } from './components/fasting-action/fasting-action.component';
@Component({
  selector: 'app-home-page',
  imports: [PageHeaderComponent, CurrentTimeComponent, FastingActionComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
