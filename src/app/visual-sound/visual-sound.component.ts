import {AfterViewInit, ChangeDetectionStrategy, OnChanges, Component, ElementRef, Input, NgZone, ViewChild} from "@angular/core";

@Component({
	selector: 'app-visual-sound',
	styleUrls: ['./visual-sound.component.css'],
	template: `
        <canvas #canvas height=40></canvas>`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisualSoundComponent implements AfterViewInit, OnChanges {
	@ViewChild("canvas")
	canvas: ElementRef;

	@Input("stream")
	audioEle = null;

	@Input()
	mute: boolean;

	canvasCtx = null;
	width: number;
	height: number = 40;
	audioCtx: AudioContext;
	gainNode: GainNode;
	radioSource: AudioNode;
	dataArray: Float32Array;
	analyser: AnalyserNode;
	swatches = [];
	prop: number;

	constructor(private ngZone: NgZone) {
	}

	initContext() {
		this.swatches = Array(10).fill(1).map(() => VisualSoundComponent.pastelColors());
		let canvas = this.canvas.nativeElement;
		this.canvasCtx = canvas.getContext("2d");
		this.width = canvas.width;
		this.height = canvas.height;
		this.audioCtx = new AudioContext();

		this.radioSource = this.audioCtx.createMediaElementSource(this.audioEle);
		this.gainNode = this.audioCtx.createGain();
		this.analyser = this.audioCtx.createAnalyser();

		this.gainNode.gain.value = 1;
		this.radioSource.connect(this.analyser);
		this.analyser.connect(this.gainNode);
		this.gainNode.connect(this.audioCtx.destination);

		this.analyser.fftSize = 64;
		let bufferLength = this.analyser.frequencyBinCount;
		this.dataArray = new Float32Array(bufferLength);
		this.prop = this.height / (this.analyser.maxDecibels - this.analyser.minDecibels);
	}

	draw() {
		this.canvasCtx.clearRect(0, 0, this.width, this.height);

		this.analyser.getFloatFrequencyData(this.dataArray);
		this.canvasCtx.fillStyle = '#474444';

		this.canvasCtx.fillRect(0, 0, this.width, this.height);
		let barWidth = (this.width / this.dataArray.length);

		let barHeight;
		let x = 0;
		for (let i = 0; i < this.dataArray.length; i++) {
			barHeight = this.prop * (this.dataArray[i] - this.analyser.minDecibels);
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

	ngOnChanges(changes) {
		if (changes.mute) {
			let muteSound = changes.mute.currentValue;
			console.log("mute sound: " + muteSound);
		}
	}
}
