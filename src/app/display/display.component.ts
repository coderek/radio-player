import {OnChanges, ViewChild, Component, Input} from "@angular/core";
import {TimerComponent} from "../timer/timer.component";
import {WebSocketService} from "../services/websocket.service";
import "rxjs/add/operator/toPromise";
import {Station} from "../models/station";
import {trim} from "../services/util.service";
import {Observable} from 'rxjs/Rx';


@Component({
  selector: 'app-display',
  providers: [WebSocketService],
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})

export class DisplayComponent implements OnChanges {
  // currently playing station
  @Input()
  station: Station = null;

  currentTrack: string = "";
  currentArtist: string = "";
  currentCoverUrl: string = "";

  stream: Observable<string>;

  @ViewChild(TimerComponent)
  private timer: TimerComponent;

  audioEle = new Audio;

  constructor(private sockService: WebSocketService) {
    this.stream = sockService.getObservable();
    this.stream.subscribe(
      (msg)=> console.log(msg),
      (err)=> console.log(err),
      ()=> console.log('stream closed')
    );
    this.sockService.setResultSelector(this.interpretServerMessage.bind(this));
    this.audioEle.crossOrigin = "anonymouse";
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

  ngOnChanges(changes) {
    if (changes.hasOwnProperty("station") && changes.station.currentValue != null) {
      console.log("ngOnChanges:", changes.station.currentValue);
      let m = changes.station.currentValue.name.match(/(\d+\.\d+)/);

      if (m) {
        this.sockService.send("CHANGE_STATION|" + m[0]);
      }

      this.timer.restart();
      let station = changes.station.currentValue;

      if (this.audioEle && station.url != null) {
        this.audioEle.src = station.url;
        if (station.action == "Pause")
          this.audioEle.play();
        else
          this.audioEle.pause();
      }
    } else {
      this.audioEle.pause();
    }
  }
}
