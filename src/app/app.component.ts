import {Component} from "@angular/core";
// import {Station} from "./models/station";

import {PlatformService} from "./services/platform.service";
import {AppService} from "./services/app.service";
import {Map, List, fromJS, Collection} from 'immutable';
import {environment} from "../environments/environment";
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
	// immutable
	stations: any;

	constructor(private platform: PlatformService, private appService: AppService) {
		this.isRunningInElectron = platform.isRunningInElectron();
		// if (typeof localStorage !== 'object') throw new Error("No localstorage! Radio can't start");
		try {
			this.iPreference = Map(JSON.parse(localStorage.getItem(USER_SETTINGS)));
			console.log('loaded iPreference: ', this.iPreference.toJS())
		} catch (e) {
			// ignore invalid iPreference settings
		}

		this.stations = fromJS(environment.stations.map((s: any)=> {
			s.action = "Play";
			return s;
		}));
	}

	onChangePreference(ev: string) {
		this.iPreference = this.iPreference.set(ev, !this.iPreference.get(ev));
		localStorage.setItem(USER_SETTINGS, JSON.stringify(this.iPreference.toJS()));
	}

	onPlayStation(station) {
		this.iCurrentStation = station;
	}
}
