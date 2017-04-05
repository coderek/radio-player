import {Component} from '@angular/core';
import {AppService} from '../services/app.service';
import {Preference} from '../models/preference';

@Component({
  selector: 'app-settings',
  template: `
    <md-slide-toggle title="Start playing when the player launch." [checked]="appService.autoPlay"
                      (change)="appService.autoPlay=!appService.autoPlay">Auto Play </md-slide-toggle>
    <md-slide-toggle title="Play random station from favorite list after every song." [color]="'warn'" 
                     [checked]="appService.playRandom" 
                     (change)="appService.playRandom=!appService.playRandom">Random</md-slide-toggle>
    <md-slide-toggle [color]="'primary'" 
                     title="Skip talkings."
                     [checked]="appService.songOnly"
                     (change)="appService.songOnly=!appService.songOnly">Song Only</md-slide-toggle>
  `,
  styles: ['md-slide-toggle {color: #868686;}']
})
export class SettingsComponent {

  constructor(public appService: AppService) {
  }
}
