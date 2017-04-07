import {Component, Input, OnInit} from "@angular/core";

const ONE_HOUR = 3600 * 1000;
const ONE_MINUTE = 60 * 1000;
const ONE_SECOND = 1000;

@Component({
	selector: 'app-timer',
	template: `{{hour}}:{{minute}}:{{second}}`,
	styles: [':host {margin: 10px; margin-bottom: 4px;}']
})
export class TimerComponent implements OnInit {
	startTime: Date = null;
	intervalHandler = null;
	hour: String = "00";
	minute: String = "00";
	second: String = "00";
	delta:number = 0;
	@Input()
	pause:boolean = false;

	constructor() {
	}

	ngOnInit() {
	}

	restart() {
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
		this.startTime = new Date;
		this.intervalHandler = setInterval(this.update.bind(this), 1000);
	}

	update() {

		if (this.pause) {
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
