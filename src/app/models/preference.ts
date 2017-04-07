import {Record} from 'immutable';

export const Preference = Record({
	autoPlay: false,
	playRandom: false,
	songOnly: false,
});