import { Injectable } from '@angular/core';
import { Subject, Observer, Observable } from 'rxjs/Rx';

@Injectable()
export class WebSocketService {
	private socket: WebSocket;
	constructor() { }
	public connect(url): WebSocket {
		if(!this.socket) {
			this.socket = new WebSocket(url);
		}
		return this.socket;
	}
}
