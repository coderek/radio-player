import {Record} from "immutable";
const USER_SETTINGS = "userSettings";


export class Preference extends Record({
	autoPlay: false,
	playRandom: false,
	songOnly: false
}) {

	constructor() {
		super();
		this.load();
	}

	save() {
		console.log('saving preference...');
		localStorage.setItem(USER_SETTINGS, this.toJS());
	}

	load() {
		try {
			const savedSettings = JSON.parse(localStorage.getItem(USER_SETTINGS));
			this.update(savedSettings);
		} catch (e) {
			localStorage.removeItem(USER_SETTINGS);
		}
	}
}
