import {ApplicationRef, Injectable} from "@angular/core";
import {Preference} from '../models/preference';

const USER_SETTINGS = "userSettings";

/**
 * Singleton service for managing global states
 */
@Injectable()
export class AppService {
  // single instance
  preference: Preference = new Preference();
  store: Storage = null;
  status: string = "By coderek";

  constructor(appRef: ApplicationRef) {
    this.store = localStorage;
    this.loadSettings();
    setTimeout(()=>appRef.tick(), 0);
  }

  get autoPlay() {
    return this.preference.autoPlay;
  }

  set autoPlay(aPlay: boolean) {
    console.log("auto play: " + aPlay);
    this.preference.autoPlay = aPlay;
    this.savePreference();
  }

  get playRandom() {
    return this.preference.playRandom;
  }

  set playRandom(pRandom:boolean) {
    console.log("play random: " + pRandom);
    this.preference.playRandom = pRandom;
    this.savePreference();
  }

  get songOnly() {
    return this.preference.songOnly;
  }

  set songOnly(_songOnly:boolean) {
    console.log("song only: " + _songOnly);
    this.preference.songOnly = _songOnly;
    this.savePreference();
  }

  savePreference() {
    this.put(USER_SETTINGS, this.preference.toJSON());
  }

  put(key, val) {
    this.store.setItem(key, JSON.stringify(val));
  }

  get(key) {
    let val = this.store.getItem(key);
    try {
      return JSON.parse(val);
    } catch (e) {
      return val;
    }
  }

  has(key) {
    return this.store.getItem(key) !== null;
  }

  loadSettings() {
    try {
      const savedSettings = JSON.parse(this.store.getItem(USER_SETTINGS));
      this.preference.load(savedSettings);
    } catch (e) {
      this.store.removeItem(USER_SETTINGS);
    }
  }
}
