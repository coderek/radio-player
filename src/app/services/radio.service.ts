import {Injectable} from '@angular/core';
import {fromJS, Map} from "immutable";
import {Observable, Subject} from "rxjs/Rx";
import {WebSocketService} from "./websocket.service";
import {ProgramMeta} from "../models/program_meta";
import {environment} from "../../environments/environment";
import {Station} from '../models/station';
import {Preference} from '../models/preference';
import {isEmpty} from "./util.service";
import {AudioService} from "./audio.service";

export enum RadioState {
	playing=1, paused, started
}

export enum RadioAction {
	new_station=1, new_program, pause, play
}

const USER_SETTINGS = "userSettings";
const LAST_PLAYED = "lastPlayed";

@Injectable()
export class RadioService {
	private stationMap: Map<string, Station> = Map<string, Station>();
	private currentPlayingStation: Station;
	private currentState: RadioState = RadioState.started;

	private nextProgram: Observable<ProgramMeta>;
	private randomRequest = new Subject<void>();
	public actions = new Subject<RadioAction>();

	constructor(private socket: WebSocketService, private audio:AudioService) {
		this.loadStations();
		let previousProgram: ProgramMeta = null;
		this.nextProgram = this.socket.observable.filter(meta=>meta!==undefined).map(meta=> {
			if (isEmpty(meta.coverUrl)) {
				meta.coverUrl = this.getDefaultCover(this.station);
			}
			if (this.station) {
				meta.stationName = this.station.get('name');
			}
			return meta;
		}).do(program=> {
			this.audio.toggleMute(isEmpty(program.author) && this.getPreferenceFromLocalStorage().songOnly);
			if (previousProgram === null || previousProgram.title !== program.title) {
				if (this.getPreferenceFromLocalStorage().playRandom) {
					this.randomRequest.next();
				}
			}
		});

		this.randomRequest.delay(1000).debounceTime(60000)
			.subscribe(this.switchRandomStation.bind(this));
	}

	get status() {
		return "By coderek";
	}

	set station(s: Station) {
		this.currentPlayingStation = s;
	}

	get station() {return this.currentPlayingStation;}

	private getFavoriteStations() {
		return this.stationMap.valueSeq().toArray().filter(station=>station.get('favorite'));
	}

	private switchRandomStation() {
		let favorites = this.getFavoriteStations();
		if (favorites.length===0) {
			favorites = this.stationMap.valueSeq().toArray();
		}
		let rand = ~~(Math.random() * favorites.length);
		this.play(favorites[rand]);
	}

	public getProgramMetaSource() {
		return this.nextProgram;
	}

	public updatePreference(key: string, val: any) {
		let pref = this.getPreferenceFromLocalStorage();
		pref[key] = val;
		this.savePreferenceToLocalStorage(pref);
	}

	private savePreferenceToLocalStorage(pref) {
		localStorage.setItem(USER_SETTINGS, JSON.stringify(pref));
	}
	private getPreferenceFromLocalStorage() {
		try {
			return JSON.parse(localStorage.getItem(USER_SETTINGS));
		} catch (e) {
			this.savePreferenceToLocalStorage({});
			return {};
		}
	}

	public startLastStopped() {
		if (localStorage.getItem(LAST_PLAYED)) {
			let lastPlayedStation = localStorage.getItem(LAST_PLAYED);
			let station = this.stationMap.get(lastPlayedStation);
			if (station)
				this.play(station);
		}
	}

	public getPreference() {
		return new Preference(this.getPreferenceFromLocalStorage());
	}

	public pause() {
		if (this.station) {
			this.audio.pause();
			this.stationMap = this.stationMap.setIn([this.station.get('name'), 'action'] , 'Play');
			this.actions.next(RadioAction.pause);
		}
	}

	public play(station: Station) {
		let name = station.get('name');

		if (!this.station || this.station.get('name') !== name) {
			// A different station

			// 1. switch socket to this station
			let m = name.match(/(\d+\.\d+)/);
			if (m) {
				this.socket.send('CHANGE_STATION|'+m[1]);
			}
			// 2. update audio service
			this.audio.setAudioSource(station.get('url'));

			// 3. update stations
			if (this.station) {
				let curStationName = this.station.get('name');
				this.stationMap = this.stationMap.setIn([curStationName, 'action'], 'Play');
			}
			this.station = this.stationMap.get(name);
			// 4. save this as last played station
			localStorage.setItem(LAST_PLAYED, this.station.get('name'));
			this.actions.next(RadioAction.new_station);
		}
		this.stationMap = this.stationMap.setIn([this.station.get('name'), 'action'], 'Pause');
		this.audio.play();
		this.actions.next(RadioAction.play);
	}

	public toggleFavorite(station: Station) {
		let favorite = station.get('favorite');
		this.stationMap = this.stationMap.setIn([station.get('name'), 'favorite'], !favorite);
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

	public getStations(): Map<string, Station> {
		return this.stationMap;
	}

	public setFavorite(station: Station) {
		this.stationMap = this.stationMap.setIn([station.get('name'), 'favorite'], true);
	}

	private loadStations() {
		environment.stations.forEach(s=> {
			s['action'] = 'Play';
			this.stationMap = this.stationMap.set(s.name,  fromJS(s));
		});
	}
}
