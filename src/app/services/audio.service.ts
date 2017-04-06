import {Injectable} from '@angular/core';

@Injectable()
export class AudioService {
	private audio = new Audio();
	private analyser;
	private gainNode;
	private dataArray;

	constructor() {
		this.audio.crossOrigin = "anonymous";

		let audioCtx = new AudioContext();

		let radioSource = audioCtx.createMediaElementSource(this.audio);
		this.gainNode = audioCtx.createGain();
		this.analyser = audioCtx.createAnalyser();

		this.gainNode.gain.value = 1;
		radioSource.connect(this.analyser);
		this.analyser.connect(this.gainNode);
		this.gainNode.connect(audioCtx.destination);

		this.analyser.fftSize = 64;
		this.dataArray = new Float32Array(this.analyser.frequencyBinCount);
	}

	setAudioSource(src: string) {
		try {
			this.audio.src = src;
		} catch (e) {

		}
	}

	play() {this.audio.play();}

	pause() {this.audio.pause();}

	isPaused() {return this.audio.paused;}

	mute() {
		this.gainNode.gain.value = 0;
	}

	unmute() {
		this.gainNode.gain.value = 1;
	}

	toggleMute(predicate: boolean) {
		console.log("predicate: " + predicate)
		if (predicate) this.mute();
		else this.unmute();
	}

	getFrequencies() {
		this.analyser.getFloatFrequencyData(this.dataArray);
		return this.dataArray;
	}

	getMinDecibels() {
		return this.analyser.minDecibels;
	}

	getDecibelsRange() {
		return this.getMaxDecibels() - this.getMinDecibels();
	}

	getMaxDecibels() {
		return this.analyser.maxDecibels;
	}
}