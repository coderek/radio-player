import {Component} from "@angular/core";
import {Station} from "./models/station";

import {PlatformService} from "./services/platform.service";
import {AppService} from "./services/app.service";
import {Preference} from "./models/preference";
@Component({
	selector: 'app-root',
	providers: [PlatformService],
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	current_station: Station = null;
	isRunningInElectron: boolean = false;
	preference: Preference;

	get status() {
		return this.appService.status;
	}

	constructor(private platform: PlatformService, private appService: AppService) {
		this.isRunningInElectron = platform.isRunningInElectron();
		this.preference = appService.getPrefernce();
	}

	onChangePreference(ev: Event) {
		console.log(ev);
	}

	onPlayStation(station) {
		this.current_station = station;
	}
}
