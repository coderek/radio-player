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

	@Input()
	currentPlaying: Station;

	constructor(private radioService: RadioService) {}

	toggleFavorite(station) {
		this.radioService.toggleFavorite(station);
	}

	pauseStation() {
		this.radioService.pause();
	}

	playStation(station) {
		this.radioService.play(station);
	}
}
