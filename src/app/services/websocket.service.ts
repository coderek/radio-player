import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import "rxjs/add/observable/dom/webSocket";
import {Observable, Subject} from "rxjs/Rx";
import {WebSocketSubject} from "rxjs/observable/dom/WebSocketSubject";
import {ProgramMeta} from "../models/program_meta";
import {deepCopy, trim} from "./util.service";
import {fromJS} from "immutable";

@Injectable()
export class WebSocketService {
	private socket: WebSocketSubject<ProgramMeta>;
	private programMeta: ProgramMeta = {};

	constructor() {
		const wsSrc = environment.ws;
		console.log("connecting to ", wsSrc)
		this.socket = Observable.webSocket(wsSrc);
		this.socket.resultSelector = this.interpretServerMessage.bind(this);
		this.socket.subscribe();
	}

	send(msg: string) {
		this.socket.next(msg);
	}

	get observable() {
		return this.socket;
	}

	interpretServerMessage(e: MessageEvent) {
		let m = e.data;
		let [key, data] = m.split("=");

		key = key.toLowerCase();

		// key can be either streamurl or streamtitle

		if (key == "streamtitle") {
			// data should be a string
			this.programMeta['title'] = data;
			return deepCopy(this.programMeta);
		}

		if (key == "streamurl") {
			// data is url encoded and can be string or json object
			if (data) data = decodeURIComponent(data).trim();
			data = trim(data, "[' ]");

			// if it's not json, we just unset related fields
			try {
				let {artist, coverUrl, id, track} =
					JSON.parse(data).current_song;
				this.programMeta['author'] = artist;
				this.programMeta['title'] = track;
				this.programMeta['coverUrl'] = coverUrl;
				return deepCopy(this.programMeta);
			} catch (e) {
				console.log('Not json', data);
			}
		}
	}
}
