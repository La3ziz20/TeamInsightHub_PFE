import { Component } from '@angular/core';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'TeamInsightHub.UI';
  isUserLogged = false;

  constructor(private localStorageService: LocalStorageService) {
    this.isUserLogged = this.localStorageService.isUserLogged();
  }
}
