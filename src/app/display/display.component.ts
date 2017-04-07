import {Component, Input, OnInit} from "@angular/core";
import {WebSocketService} from "../services/websocket.service";
import "rxjs/add/operator/toPromise";
import 'rxjs/operator/debounceTime';
import 'rxjs/Subject';
import {ProgramMeta} from "../models/program_meta";
import {Observable} from "rxjs";

@Component({
	selector: 'app-display',
	templateUrl: './display.component.html',
	styleUrls: ['./display.component.css'],
})
export class DisplayComponent implements OnInit {
	@Input()
	program: Observable<ProgramMeta>;

	private name: string;
	private coverUrl: string;
	private title: string;
	private author: string;

	ngOnInit() {
		this.program.subscribe(
			program=> {
				this.name = program.stationName;
				this.coverUrl = program.coverUrl;
				this.title = program.title;
				this.author = program.author;
			}
		);
	}
}
