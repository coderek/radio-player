import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {environment} from "environments/environment";
import {AppService} from "../services/app.service";
import {Station} from "../models/station";
import {Preference} from "../models/preference";

@Component({
	selector: 'app-list',
	providers: [],
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit, AfterViewInit {
	stations: Station[] = [];
	preference: Preference;

	@Output()
	onPlayStation = new EventEmitter<{}>();
	selected = null;

	constructor(private appService: AppService) {
		this.stations = environment.stations;
		this.stations.forEach((s) => s.action = "Play");
		this.preference = this.appService.getPrefernce();
	}

	ngOnInit() {
	}

	resumePlaying() {
		setTimeout(() => {
			if (this.appService.has("last_played")) {
				let name = this.appService.get("last_played");
				let station = this.stations.find((s) => s.name == name);
				if (station)
					this.playStation(station);
			}
		}, 0);
	}

	ngAfterViewInit() {
		if (this.preference.get('autoPlay')) {
			this.resumePlaying();
		}
	}

	toggleFavorite(station: Station) {
		if (station)
			station.favorite = !station.favorite;
	}

	pauseStation(station: Station) {
		if (station)
			station.action = "Play";

		// this.onPlayStation.emit({
		//   name: station.name,
		//   url: station.url,
		//   action: station.action
		// });
	}

	playStation(station: Station) {
		this.pauseStation(this.selected);
		station.action = "Pause";
		this.selected = station;
		this.appService.put("last_played", station.name);
		this.onPlayStation.emit({
			name: station.name,
			url: station.url,
			action: station.action
		});
	}
}
