import {Injectable} from "@angular/core";
import {Settings} from '../models/settings';

const USER_SETTINGS = "userSettings";

/**
 * Singleton service for managing global states
 *
 *
 */
@Injectable()
export class AppService {
  // single instance
  settings: Settings = new Settings();
  store: Storage = null;
  status: string = "By coderek";

  constructor() {
    this.store = localStorage;
    this.loadSettings();
  }

  get autoPlay() {
    return this.settings.autoPlay || false;
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

  getSettings() : Settings {
    return this.settings;
  }

  has(key) {
    return this.store.getItem(key) != null;
  }

  loadSettings() {
    try {
      const savedSettings = JSON.parse(this.store.getItem(USER_SETTINGS));
      this.settings.load(savedSettings);
    } catch (e) {
      this.store.removeItem(USER_SETTINGS);
    }
  }

  saveSettings(settings: Settings) {
    if (settings!==null)
      this.store.setItem(USER_SETTINGS, JSON.stringify((settings)));
  }
}
