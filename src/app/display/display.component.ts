import { ElementRef, SimpleChanges, Directive, OnChanges, ViewChild, Component, OnInit, Input } from '@angular/core';
import { TimerComponent } from '../timer/timer.component';
import { Http } from '@angular/http';
import { WebSocketService } from '../web-socket.service';

import 'rxjs/add/operator/toPromise';
import {Subject} from 'rxjs/Rx';
import { Station } from '../station';
import { trim } from '../util.service';


@Component({
    selector: 'app-display',
    providers: [WebSocketService],
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.css']
})

export class DisplayComponent implements OnChanges {
    // currently playing station
    @Input()
    station:Station=null;

    currentTrack:string="";
    currentArtist:string="";
    currentCoverUrl:string="";

    socket: WebSocket;
    mq = []; // message queue

    @ViewChild(TimerComponent)
    private timer: TimerComponent;

    audioEle = new Audio;

    constructor(private sockService: WebSocketService) {
        this.socket = sockService.connect("ws://pi:4201");
        this.socket.onopen = ()=>{
            console.log("Socket open");
            let checkAndSend = ()=> {
                let next = this.mq.pop();
                if (next === null) {
                    console.log("Exit message loop");
                    return;
                }
                if (next !== undefined) {
                    console.log("Sending message:" + next);
                    this.socket.send(next);
                }
                setTimeout(checkAndSend, 0);
            };
            checkAndSend();
        }
        this.socket.onclose = ()=>{
            console.log("Socket closed");
            this.mq.push(null);
        }

        this.socket.onmessage = (m)=> this.handleMessage(m);
        this.audioEle.crossOrigin = "anonymouse";
    }

    handleMessage(m) {
        let [key, data] = m.data.split("=");

        key = key.toLowerCase();

        if (data) data = decodeURIComponent(data).trim();
        data = trim(data, "[' ]");

        if (key == "streamurl") {
            try {
                let {artist, coverUrl, id, track} = JSON.parse(data).current_song;
                this.currentArtist = artist;
                this.currentTrack = track;
                this.currentCoverUrl = coverUrl;
            } catch(e) {
                this.currentTrack = "";
                this.currentArtist = "";
                this.currentCoverUrl = "";
                console.log("Not valid json: " + data);
            }
        } else if (key == "streamtitle") {
            this.currentTrack = data;
        }
    }

    ngOnChanges(changes) {
        if (changes.hasOwnProperty("station") && changes.station.currentValue!=null) {
            console.log("ngOnChanges:", changes.station.currentValue);
            let m = changes.station.currentValue.name.match(/(\d+\.\d+)/);

            if (m) {
                console.log("send CHANGE_STATION "+m[0]);
                this.mq.push("CHANGE_STATION|"+m[0]);
            }

            this.timer.restart();
            let station = changes.station.currentValue;

            if (this.audioEle && station.url != null) {
                this.audioEle.src = station.url;
                console.log(station);
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
