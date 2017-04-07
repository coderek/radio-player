import {Injectable} from '@angular/core';
import {fromJS, Map} from "immutable";
import {Subject} from "rxjs/Rx";
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
const USER_SETTINGS = "userSettings";

@Injectable()
export class RadioService {
	private stationMap: Map<string, Station> = Map<string, Station>();
	private currentPlayingStation: Station;
	private currentState: RadioState = RadioState.started;

	public nextProgram: Subject<ProgramMeta>;

	constructor(private socket: WebSocketService, private audio:AudioService) {
		this.loadStations();
	}

	set station(s: Station) {
		this.currentPlayingStation = s;
	}

	get station() {return this.currentPlayingStation;}

	set state(s: RadioState) {
		this.currentState = s;
	}

	get state() {return this.currentState;}

	public getProgramMetaSource() {
		return this.socket.observable.map(meta=> {
			if (isEmpty(meta.coverUrl)) {
				meta.coverUrl = this.getDefaultCover(this.station);
			}
			if (this.station) {
				meta.stationName = this.station.get('name');
			}
			return meta;
		});
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

	public getPreference() {
		return new Preference(this.getPreferenceFromLocalStorage());
	}

	public pickRandom() {

	}

	public pause() {
		if (this.station) {
			this.audio.pause();
			this.stationMap = this.stationMap.setIn([this.station.get('name'), 'action'] , 'Play');
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
		}
		this.stationMap = this.stationMap.setIn([this.station.get('name'), 'action'], 'Pause');
		this.audio.play();
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

	private notifyProgramChanged(program: ProgramMeta) {
		this.nextProgram.next(program);
	}
}
