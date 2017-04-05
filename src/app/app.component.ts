import {Component} from "@angular/core";
import {Station} from "./models/station";

import { PlatformService } from './services/platform.service';
import {AppService} from './services/app.service';
@Component({
  selector: 'app-root',
  providers: [PlatformService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  current_station: Station = null;
  isRunningInElectron: boolean=false;
  get status() {
    return this.appService.status;
  }
  constructor(private platform: PlatformService, private appService: AppService) {
    this.isRunningInElectron = platform.isRunningInElectron();
  }

  onPlayStation(station) {
    this.current_station = station;
  }
}
