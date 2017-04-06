import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AppService} from "../services/app.service";

@Component({
	selector: 'app-list',
	providers: [],
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, AfterViewInit {

	@Output()
	onPlayStation = new EventEmitter<any>();

	@Output()
	favorites = new EventEmitter<any[]>();

	selected = null;

	@Input()
	iPreference;

	@Input()
	stations;

	constructor(private appService: AppService) {
	}

	ngOnInit() {
	}

	resumePlaying() {
		setTimeout(() => {
			if (this.appService.has("last_played")) {
				let name = this.appService.get("last_played");
				let station = this.stations.find((s) => s.get('name') == name);
				if (station)
					this.playStation(station);
			}
		}, 0);
	}

	ngAfterViewInit() {
		if (this.iPreference.get('autoPlay')) {
			this.resumePlaying();
		}
	}

	toggleFavorite(station) {
		if (station) {
			let idx = this.stations.findIndex(a=>a.get('name')===station.get('name'));
			this.stations = this.stations.set(idx, station.set('favorite', !station.get('favorite')));
			this.favorites.emit(this.stations.filter(a=>a.get('favorite')));
		}
	}

	pauseStation(station) {
		if (station) {
			let idx = this.stations.findIndex(a=>a.get('name')===station.get('name'))
			this.stations = this.stations.setIn([idx, 'action'], 'Play');
			this.onPlayStation.emit(this.stations.get(idx));
		}

	}

	playStation(station) {
		this.pauseStation(this.selected);
		let idx = this.stations.findIndex(a=>a.get('name')===station.get('name'))
		this.stations = this.stations.set(idx, station.set('action', 'Pause'));
		let newStation = this.stations.get(idx);
		this.selected = newStation;
		this.appService.put("last_played", station.get('name'));
		this.onPlayStation.emit(newStation);
	}
}
