import {Component, EventEmitter, Input, OnChanges, Output, ViewChild} from "@angular/core";
import {TimerComponent} from "../timer/timer.component";
import {WebSocketService} from "../services/websocket.service";
import "rxjs/add/operator/toPromise";
import {trim} from "../services/util.service";
import {Observable, Subject} from "rxjs/Rx";
import {AudioService} from "../services/audio.service";
import 'rxjs/operator/debounceTime';
import 'rxjs/Subject';

export enum ProgramType {
	SONG=1, OTHER
}


@Component({
	selector: 'app-display',
	providers: [WebSocketService],
	templateUrl: './display.component.html',
	styleUrls: ['./display.component.css'],
})
export class DisplayComponent implements OnChanges {
	@Input()
	iStation: any = null;

	programs = new Subject();

	@Output()
	onNewProgram = this.programs.delay(1000).debounceTime(60000); // change frequency should not be less than 60s

	@Input()
	iPreference;

	get paused() {
		return this.audioService.isPaused();
	}
	currentTrack: string = "";
	currentArtist: string = "";
	currentCoverUrl: string = "";
	muteAudio = false;

	private _programType:ProgramType;
	get currentProgramType() {
		return this._programType;
	}

	set currentProgramType(_programType: ProgramType) {
		if (_programType!== this.currentProgramType) {
			this.programs.next(_programType);
		}
		this._programType = _programType;
	}

	stream: Observable<string>;

	@ViewChild(TimerComponent)
	private timer: TimerComponent;

	constructor(private sockService: WebSocketService, private audioService: AudioService) {
		this.stream = sockService.getObservable();
		this.stream.subscribe(
			(msg) => '',
			(err) => console.log(err),
			() => console.log('stream closed')
		);
		this.sockService.setResultSelector(this.interpretServerMessage.bind(this));
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
				this.currentProgramType = ProgramType.SONG;
			} catch (e) {
				console.log('Not json', data);
				// this.currentTrack = "";
				this.currentArtist = "";
				this.currentCoverUrl = "";
				this.currentProgramType = ProgramType.OTHER;
			}
			this.checkSongOnly()
		}
	}

	playingSong(): boolean {
		return this.currentArtist !== '';
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

	checkSongOnly() {
		let songOnly = this.iPreference.get('songOnly');
		console.log("songOnly: " + songOnly, this.playingSong())
		let shouldMute = songOnly && !this.playingSong();
		this.audioService.toggleMute(shouldMute);
	}

	ngOnChanges(changes) {
		if (changes.iPreference) {
			let {firstChange, previousValue, currentValue} = changes.iPreference;
			if (firstChange || currentValue) {
				this.checkSongOnly();
			}
		}

		if (changes.iStation) {
			let {firstChange, previousValue, currentValue} = changes.iStation;

			if (previousValue!== undefined && previousValue.get('name') === currentValue.get('name')) {
				console.log('fuck', currentValue)
				if (currentValue.get('action') === 'Play') {
					this.audioService.pause();
				} else {
					this.audioService.play();
				}
			} else if (firstChange || currentValue!==undefined) {
				let m = currentValue.get('name').match(/(\d+\.\d+)/);
				if (m) {
					this.sockService.send("CHANGE_STATION|" + m[0]);
					this.timer.restart();
					this.audioService.setAudioSource(currentValue.get('url'));
					this.audioService.play();
				}
			}
		}
	}
}
