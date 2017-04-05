import {Injectable} from "@angular/core";

/**
 * Singleton service for managing global states
 */
@Injectable()
export class AppService {
	// single instance
	store: Storage = null;
	status: string = "By coderek";

	constructor() {
		this.store = localStorage;
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
