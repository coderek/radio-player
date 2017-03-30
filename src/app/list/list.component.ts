import {EventEmitter, Output, Component, OnInit, AfterViewInit} from "@angular/core";
import {environment} from "environments/environment";
import {StorageService} from "../services/storage.service";
import {Station} from "../models/station";

@Component({
  selector: 'app-list',
  providers: [StorageService],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit, AfterViewInit {
  stations: Station[] = []
  @Output()
  onPlayStation = new EventEmitter<{}>();
  selected = null;

  constructor(private storage: StorageService) {
    this.stations = environment.stations;
    this.stations.forEach((s) => s.action = "Play");
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.storage.has("last_played")) {
        let name = this.storage.get("last_played");
        let station = this.stations.find((s) => s.name == name);
        if (station)
          this.playStation(station);
      }
    }, 0);

  }

  playStation(station) {

    if (station == this.selected) {
      // toggle
      if (station.action == "Play") {
        station.action = "Pause";
      } else {
        station.action = "Play";
      }
    } else {
      if (this.selected != null) {
        this.selected.action = "Play";
      }
      station.action = "Pause";
    }

    this.selected = station;
    this.storage.put("last_played", station.name);
    this.onPlayStation.emit({
      name: station.name,
      url: station.url,
      action: station.action
    });
  }
}
