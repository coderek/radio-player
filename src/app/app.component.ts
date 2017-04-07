import {Component, Input, OnInit} from "@angular/core";
import {PlatformService} from "./services/platform.service";
import {RadioService} from "./services/radio.service";

@Component({
	selector: 'app-root',
	providers: [PlatformService],
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	isRunningInElectron: boolean = false;

	get status() {
		return this.radioService.status;
	}

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
	@Input()
	get currentPlaying() {
		return this.radioService.station;
	}

	constructor(private platform: PlatformService, private radioService: RadioService) {
		this.isRunningInElectron = platform.isRunningInElectron();
	}

	ngOnInit() {
		if (this.preference.autoPlay) {
			this.radioService.startLastStopped();
		}
	}
}
