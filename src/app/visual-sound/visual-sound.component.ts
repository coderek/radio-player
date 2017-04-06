import {AfterViewInit, ChangeDetectionStrategy, OnChanges, Component, ElementRef, Input, NgZone, ViewChild} from "@angular/core";
import {AudioService} from "../services/audio.service";

@Component({
	selector: 'app-visual-sound',
	styleUrls: ['./visual-sound.component.css'],
	template: `
        <canvas #canvas height=40></canvas>`,
})
export class VisualSoundComponent implements AfterViewInit {
	@ViewChild("canvas")
	canvas: ElementRef;

	canvasCtx = null;
	width: number;
	height: number = 40;
	swatches = [];
	prop: number;

	constructor(private ngZone: NgZone, private audioService: AudioService) {}

	initContext() {
		this.swatches = Array(10).fill(1).map(() => VisualSoundComponent.pastelColors());
		let canvas = this.canvas.nativeElement;
		this.canvasCtx = canvas.getContext("2d");
		this.width = canvas.width;
		this.height = canvas.height;

		let audioRange = this.audioService.getDecibelsRange();
		this.prop = this.height / audioRange;
	}

	draw() {
		this.canvasCtx.clearRect(0, 0, this.width, this.height);
		this.canvasCtx.fillStyle = '#474444';
		this.canvasCtx.fillRect(0, 0, this.width, this.height);
		let dataArray = this.audioService.getFrequencies();

		let barWidth = (this.width / dataArray.length);
		let barHeight;

		let x = 0;
		for (let i = 0; i < dataArray.length; i++) {
			barHeight = this.prop * (dataArray[i] - this.audioService.getMinDecibels());
			this.drawBar(x, barWidth, barHeight);
			x += barWidth + 1;
		}
		requestAnimationFrame(() => this.draw());
	}

	static pastelColors() {
		let r = (Math.round(Math.random() * 127) + 127).toString(16);
		let b = (Math.round(Math.random() * 127) + 127).toString(16);
		let g = (Math.round(Math.random() * 127) + 127).toString(16);
		return '#' + r + g + b;
	}

	drawBar(x, barWidth, barHeight) {

		let squareSize = barWidth;
		let squares = ~~(barHeight / squareSize);

		for (let i = 0; i < squares; i++) {
			this.canvasCtx.fillStyle = this.swatches[i % this.swatches.length];
			this.canvasCtx.fillRect(x, this.height - (squareSize + 1) * i, squareSize, squareSize);
		}
	}

	ngAfterViewInit() {
		this.initContext();
		this.ngZone.runOutsideAngular(() => this.draw());
	}
}
