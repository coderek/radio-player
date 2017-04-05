import {Injectable} from "@angular/core";
import {Preference} from "../models/preference";

/**
 * Singleton service for managing global states
 */
@Injectable()
export class AppService {
	// single instance
	preference: Preference = new Preference();
	store: Storage = null;
	status: string = "By coderek";

	constructor() {
		this.store = localStorage;
	}

	getPrefernce() {
		return this.preference;
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
}
