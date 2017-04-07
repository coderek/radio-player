import {Component, Input, ViewChild} from "@angular/core";
import {PlatformService} from "./services/platform.service";
import {AppService} from "./services/app.service";
import {Map} from 'immutable';
import {RadioService} from "./services/radio.service";
import {TimerComponent} from "./timer/timer.component";
const USER_SETTINGS = "userSettings";

@Component({
	selector: 'app-root',
	providers: [PlatformService],
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	isRunningInElectron: boolean = false;

	get status() {
		return this.appService.status;
	}

	@ViewChild(TimerComponent)
	timer: TimerComponent;

	@Input()
	get programMeta () {
		return this.radioService.getProgramMetaSource();
	}
	@Input()
	get stations() {
		return this.radioService.getStations();
	}
	@Input()
	get preference() {
		return this.radioService.getPreference();
	}
	randomScheduler = null;

	constructor(
			private platform: PlatformService,
			private appService: AppService,
			private radioService: RadioService) {

		this.isRunningInElectron = platform.isRunningInElectron();
		let favorites = appService.get('favorites') || [];
	}
/*
	onNewProgram(type: ProgramType) {
		let playRandom = this.preference.get('playRandom');
		if (playRandom) {
			let favorites = this.appService.get('favorites');
			if (favorites.length===0) return;
			let randomChosen = favorites[~~(Math.random() * favorites.length)];
			console.log('Playing random station: ' + randomChosen.name);

			let station = Map(randomChosen);
			this.onPlayStation(station);
			this.list.playStation(station);
		}
	}*/

	onPlayStation(station) {
		// this.iCurrentStation = station;
	}

	onChangeFavorites(stationNames: any[]) {
		this.appService.put("favorites", stationNames);
	}
}
