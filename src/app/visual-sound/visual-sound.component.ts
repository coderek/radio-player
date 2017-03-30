import {ElementRef, AfterViewInit, ViewChild, OnChanges, Input, Component} from "@angular/core";

@Component({
  selector: 'app-visual-sound',
  styleUrls: ['./visual-sound.component.css'],
  template: `<canvas #canvas height=40></canvas>`
})
export class VisualSoundComponent implements OnChanges, AfterViewInit {
  @ViewChild("canvas")
  canvas: ElementRef;

  canvasCtx = null;

  width: number;
  height: number = 40;

  @Input("stream")
  audioEle = null;
  audioCtx: AudioContext;
  gainNode: GainNode;
  radioSource: AudioNode;
  dataArray: Float32Array;
  analyser: AnalyserNode;
  swatches = [];

  constructor() {
  }

  initContext() {
    this.swatches = Array(10).fill(1).map(() => this.pastelColors());
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
    var bufferLength = this.analyser.frequencyBinCount;
    console.log(bufferLength);
    this.dataArray = new Float32Array(bufferLength);
  }

  ngOnChanges() {
    if (this.audioEle) {
      this.update();
    } else {
      this.clear();
    }
  }

  draw() {
    this.canvasCtx.clearRect(0, 0, this.width, this.height);

    requestAnimationFrame(() => this.draw());
    this.analyser.getFloatFrequencyData(this.dataArray);

    this.canvasCtx.fillStyle = '#474444';
    this.canvasCtx.fillRect(0, 0, this.width, this.height);

    var barWidth = (this.width / this.dataArray.length);
    var barHeight;
    var x = 0;
    for (var i = 0; i < this.dataArray.length; i++) {
      barHeight = this.height * (this.dataArray[i] - this.analyser.minDecibels) / (this.analyser.maxDecibels - this.analyser.minDecibels);
      this.drawBar(x, barWidth, barHeight);
      x += barWidth + 1;
    }
  }


  pastelColors() {
    var r = (Math.round(Math.random() * 127) + 127).toString(16);
    var g = (Math.round(Math.random() * 127) + 127).toString(16);
    var b = (Math.round(Math.random() * 127) + 127).toString(16);
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
    this.draw();
  }

  update() {
    console.log("fucking" + this.audioEle);
  }

  clear() {

  }

}
