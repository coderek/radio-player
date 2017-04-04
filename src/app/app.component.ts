import {Component} from "@angular/core";
import {Station} from "./models/station";

import { PlatformService } from './services/platform.service';

@Component({
  selector: 'app-root',
  providers: [PlatformService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  current_station: Station = null;
  isRunningInElectron: boolean=false;

  constructor(platform: PlatformService) {
    this.isRunningInElectron = platform.isRunningInElectron();
  }

  onPlayStation(station) {
    this.current_station = station;
  }
}
