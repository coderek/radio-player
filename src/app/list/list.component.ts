import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {AppService} from "../services/app.service";
import {RadioService} from "../services/radio.service";
import {Station} from "../models/station";

@Component({
	selector: 'app-list',
	providers: [],
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
	@Input()
	stations: Map<string, Station>;

	private currentPlaying: Station = null;

	constructor(private appService: AppService, private radioService: RadioService) {}
	//
	// resumePlaying() {
	// 	setTimeout(() => {
	// 		if (this.appService.has("last_played")) {
	// 			let name = this.appService.get("last_played");
	// 			let station = this.stations.find((s) => s.get('name') == name);
	// 			if (station)
	// 				this.playStation(station);
	// 		}
	// 	}, 0);
	// }

	toggleFavorite(station) {
		this.radioService.toggleFavorite(station);
	}

	pauseStation() {
		this.radioService.pause();
	}

	playStation(station) {
		this.radioService.play(station);
		this.currentPlaying = station;
	}
}
