import {Component, ViewChild} from "@angular/core";
// import {Station} from "./models/station";

import {PlatformService} from "./services/platform.service";
import {AppService} from "./services/app.service";
import {Map, List, fromJS, Collection} from 'immutable';
import {environment} from "../environments/environment";
import {ProgramType} from "./display/display.component";
import {ListComponent} from "./list/list.component";
const USER_SETTINGS = "userSettings";

@Component({
	selector: 'app-root',
	providers: [PlatformService],
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	iCurrentStation:any = Map({
		name: '',
		url: '',
		action: '',
		favorite: false
	});

	isRunningInElectron: boolean = false;

	iPreference: any = Map({
		songOnly: false,
		playRandom: false,
		autoPlay: false
	});

	get status() {
		return this.appService.status;
	}

	@ViewChild(ListComponent)
	list: ListComponent;

	// immutable
	stations: any;
	randomScheduler = null;

	constructor(private platform: PlatformService, private appService: AppService) {
		this.isRunningInElectron = platform.isRunningInElectron();
		// if (typeof localStorage !== 'object') throw new Error("No localstorage! Radio can't start");
		try {
			this.iPreference = Map(JSON.parse(localStorage.getItem(USER_SETTINGS)));
			console.log('loaded iPreference: ', this.iPreference.toJS())
		} catch (e) {
			// ignore invalid iPreference settings
		}
		let favorites = this.appService.get('favorites') || [];
		this.stations = fromJS(environment.stations.map((s: any)=> {
			s.action = "Play";
			s.favorite = !!favorites.find(f=>f.name===s.name);
			return s;
		}));
	}

	onChangePreference(ev) {
		this.iPreference = this.iPreference.set(ev.key, ev.val);
		localStorage.setItem(USER_SETTINGS, JSON.stringify(this.iPreference.toJS()));
	}

	onNewProgram(type: ProgramType) {
		let playRandom = this.iPreference.get('playRandom');
		if (playRandom) {
			let favorites = this.appService.get('favorites');
			if (favorites.length===0) return;
			let randomChosen = favorites[~~(Math.random() * favorites.length)];
			console.log('Playing random station: ' + randomChosen.name);

			let station = Map(randomChosen);
			this.onPlayStation(station);
			this.list.playStation(station);
		}
	}

	onPlayStation(station) {
		this.iCurrentStation = station;
	}

	onChangeFavorites(stationNames: any[]) {
		this.appService.put("favorites", stationNames);
	}
}
