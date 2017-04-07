import {Component} from "@angular/core";
import {RadioAction, RadioService} from "../services/radio.service";

const ONE_HOUR = 3600 * 1000;
const ONE_MINUTE = 60 * 1000;
const ONE_SECOND = 1000;

@Component({
	selector: 'app-timer',
	template: `{{hour}}:{{minute}}:{{second}}`,
	styles: [':host {margin: 10px; margin-bottom: 4px;}']
})
export class TimerComponent  {
	startTime: Date = null;
	intervalHandler = null;
	hour: String = "00";
	minute: String = "00";
	second: String = "00";
	delta:number = 0;
	_pause = false;

	constructor(private radioService: RadioService) {
		radioService.actions
			.subscribe(state=> {
				switch (state) {
					case RadioAction.play:
						this._pause = false;
						if (this.intervalHandler === null)
							this.start();
						break;
					case RadioAction.pause:
						this.pause();
						break;
					case RadioAction.new_station:
						this.clear();
						break;
				}
			});
	}

	pause() {
		this._pause = true;
	}

	restart() {
		this._pause = false;
		console.info("Timer restart");
		this.clear();
		this.start();
	}

	clear() {
		if (this.intervalHandler != null) {
			clearInterval(this.intervalHandler);
			this.intervalHandler = null;
		}
	}

	start() {
		this._pause = false;
		this.startTime = new Date;
		this.intervalHandler = setInterval(this.update.bind(this), 1000);
	}

	update() {
		if (this._pause) {
			this.startTime = new Date(Date.now() - this.delta);
			return;
		}

		let now = new Date;
		this.delta = now.valueOf() - this.startTime.valueOf();
		let delta = this.delta;

		let hoursPassed = ~~(delta / ONE_HOUR);
		this.hour = `${~~(hoursPassed / 10)}${hoursPassed % 10}`;

		delta %= ONE_HOUR;
		let minutesPassed = ~~(delta / ONE_MINUTE);
		this.minute = `${~~(minutesPassed / 10)}${minutesPassed % 10}`;

		delta %= ONE_MINUTE;
		let secondsPassed = ~~(delta / ONE_SECOND);
		this.second = `${~~(secondsPassed / 10)}${secondsPassed % 10}`;
	}

}
