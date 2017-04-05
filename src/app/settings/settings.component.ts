import {Component} from '@angular/core';
import {AppService} from '../services/app.service';
import {Settings} from '../models/settings';

@Component({
  selector: 'app-settings',
  template: `
    <md-slide-toggle [checked]="settings.autoPlay">Auto Play </md-slide-toggle>
    <md-slide-toggle [color]="'warn'" [checked]="settings.playRandom">Random</md-slide-toggle>
    <md-slide-toggle [color]="'primary'" [checked]="settings.songOnly">Song Only</md-slide-toggle>
  `,
  styles: ['md-slide-toggle {color: #868686;}']
})
export class SettingsComponent {
  settings: Settings = null;

  constructor(private appService: AppService) {
    this.settings = this.appService.getSettings();
  }
}

// .i-897 {background: url(/blob/5004966/53d6af15afdc584d50bdf5df91f05810/897fm-png-data.png) no-repeat;}
// .i-905 {background: url(/blob/5004968/3721d3d9c486d2eefddfa648fd221648/905fm-png-data.png) no-repeat;}
// .i-924 {background: url(/blob/6251648/f174bde3b3ca3c32e65f67c74c0be6b9/i-symphony-data.png) no-repeat; background-size: 90%;}
// .i-933 {background: url(/blob/5004972/64aff4794afe33285316347ebaa640f0/933fm-png-data.png) no-repeat;}
// .i-938 {background: url(/blob/5004974/f42282217652a8040e5204fd04a466a6/938fm-png-data.png) no-repeat;}
// .i-942 {background: url(/blob/5004976/417a54d9b5bd19c9fd90e5246e7a1596/942fm-png-data.png) no-repeat;}
// .i-950 {background: url(/blob/5004978/e4c495ee17323888f08fc3883d0baaf5/950fm-png-data.png) no-repeat;}
// .i-958 {background: url(/blob/5004980/7e185a34b7f1a4b1c79ceb76f4e39c7d/958fm-png-data.png) no-repeat;}
// .i-963x {background: url(/blob/5004982/5db236a16748b293555ca14951eddb13/963xfm-png-data.png) no-repeat;}
// .i-968 {background: url(/blob/5004984/886a21221eb2ba306102ad08de6d0d56/968fm-png-data.png) no-repeat;}
// .i-972 {background: url(/blob/5004986/6ae3d89491828c46c65ab73320bf17c5/972fm-png-data.png) no-repeat;  background-size:95%;}
// .i-987 {background: url(/blob/5004988/ab6cbeb5c451aa07d98b1750145e94e9/987fm-png-data.png) no-repeat;}
