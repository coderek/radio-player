import {Component} from "@angular/core";
import {Station} from "./models/station";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app works!';
  current_station: Station = null;

  onPlayStation(station) {
    this.current_station = station;
  }
}
