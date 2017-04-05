import {ChangeDetectionStrategy, Component, Input, OnChanges, ViewChild} from "@angular/core";
import {TimerComponent} from "../timer/timer.component";
import {WebSocketService} from "../services/websocket.service";
import "rxjs/add/operator/toPromise";
// import {Station} from "../models/station";
import {trim} from "../services/util.service";
import {Observable} from "rxjs/Rx";

@Component({
	selector: 'app-display',
	providers: [WebSocketService],
	templateUrl: './display.component.html',
	styleUrls: ['./display.component.css'],
})
export class DisplayComponent implements OnChanges {
	@Input()
	iStation: any = null;

	@Input()
	iPreference;

	get paused() {
		return this.audioEle.paused;
	}
	currentTrack: string = "";
	currentArtist: string = "";
	currentCoverUrl: string = "";
	muteAudio = false;

	stream: Observable<string>;

	@ViewChild(TimerComponent)
	private timer: TimerComponent;

	audioEle = new Audio;

	constructor(private sockService: WebSocketService) {
		this.stream = sockService.getObservable();
		this.stream.subscribe(
			(msg) => '',
			(err) => console.log(err),
			() => console.log('stream closed')
		);
		this.sockService.setResultSelector(this.interpretServerMessage.bind(this));
		this.audioEle.crossOrigin = "anonymous";
	}

	interpretServerMessage(e: MessageEvent) {
		let m = e.data;
		let [key, data] = m.split("=");

		key = key.toLowerCase();

		// key can be either streamurl or streamtitle

		if (key == "streamtitle") {
			// data should be a string
			this.currentTrack = data;
		}

		if (key == "streamurl") {
			// data is url encoded and can be string or json object
			if (data) data = decodeURIComponent(data).trim();
			data = trim(data, "[' ]");

			// if it's not json, we just unset related fields
			try {
				let {artist, coverUrl, id, track} = JSON.parse(data).current_song;
				this.currentArtist = artist;
				this.currentTrack = track;
				this.currentCoverUrl = coverUrl;
			} catch (e) {
				this.currentTrack = "";
				this.currentArtist = "";
				this.currentCoverUrl = "";
			}
		}
	}

	playingSong(): boolean {
		return this.currentTrack !== '' && this.currentArtist !== '';
	}

	getDefaultCover(station) {
		if (station === null) return '';

		let matcher = /(\d{2,3}\.\d)/;
		let matched = station.get('name').match(matcher);
		if (matched) {
			let freq = matched[1];
			return `/assets/images/${freq}_cover.jpg`;
		}
		return '';
	}

	ngOnChanges(changes) {
		if (changes.iPreference) {
			let pref = changes.iPreference.currentValue;
			if (pref) {
				let songOnly = pref.get('songOnly');
				this.muteAudio = songOnly && this.playingSong();
			}
		}

		if (changes.iStation) {
			console.log(changes.iStation);
			let {previousValue, currentValue} = changes.iStation;

			if (previousValue!== undefined && previousValue.get('name') === currentValue.get('name')) {
				console.log('fuck', currentValue)
				if (currentValue.get('action') === 'Play') {
					this.audioEle.pause();
				} else {
					this.audioEle.play();
				}
			} else if (currentValue!==undefined) {
				let m = currentValue.get('name').match(/(\d+\.\d+)/);
				if (m) {
					this.sockService.send("CHANGE_STATION|" + m[0]);
					this.timer.restart();
					this.audioEle.src = currentValue.get('url');
					this.audioEle.play();
				}
			}
		}
	}
}
