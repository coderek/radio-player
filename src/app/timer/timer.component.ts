import {Component, OnInit} from "@angular/core";

const ONE_HOUR = 3600 * 1000;
const ONE_MINUTE = 60 * 1000;
const ONE_SECOND = 1000;

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html'
})
export class TimerComponent implements OnInit {
  startTime: Date = null;
  intervalHandler = null;
  hour: String = "00";
  minute: String = "00";
  second: String = "00";

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
    let now = new Date;
    let delta = now.valueOf() - this.startTime.valueOf();
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
