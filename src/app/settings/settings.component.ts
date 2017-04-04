import {Component} from '@angular/core';
import {AppService} from '../services/app.service';
import {Settings} from '../models/settings';

@Component({
  selector: 'app-settings',
  template: `
    <md-slide-toggle [checked]="settings.autoPlay">Auto Play </md-slide-toggle>
  `,
  styles: []
})
export class SettingsComponent {
  settings: Settings = null;

  constructor(private appService: AppService) {
    this.settings = this.appService.getSettings();
  }
}
