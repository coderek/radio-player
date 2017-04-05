import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import "rxjs/add/observable/dom/webSocket";
import {Observable} from "rxjs/Rx";
import {WebSocketSubject} from "rxjs/observable/dom/WebSocketSubject";

@Injectable()
export class WebSocketService {
	private socket: WebSocketSubject<string>;

	constructor() {
		const wsSrc = environment.ws;
		console.log("connecting to ", wsSrc)
		this.socket = Observable.webSocket(wsSrc);
	}

	send(msg: string) {
		this.socket.next(msg);
	}

	getObservable(): Observable<string> {
		return this.socket as Observable<string>;
	}

	setResultSelector(selector: (e: MessageEvent) => any) {
		this.socket.resultSelector = selector;
	}
}
