import {ChangeDetectionStrategy, Component, Input, OnChanges} from "@angular/core";
import {Preference} from "../models/preference";

@Component({
	selector: 'app-settings',
	template: `
        <md-slide-toggle title="Start playing when the player launch."
                         [ngClass]="{checked: autoPlay.checked}"
                         [checked]="preference.get('autoPlay')"
                         (change)="preference.set('autoPlay', !preference.get('autoPlay'))"
                         #autoPlay>
            Auto Play
        </md-slide-toggle>
        <md-slide-toggle title="Play random station from favorite list after every song." [color]="'warn'"
                         [ngClass]="{checked: playRandom.checked}"
                         [checked]="preference.get('playRandom')"
                         (change)="preference.set('playRandom', !preference.get('playRandom'))"
                         #playRandom>Random
        </md-slide-toggle>
        <md-slide-toggle [color]="'primary'"
                         [ngClass]="{checked: songOnly.checked}"
                         title="Skip talkings."
                         [checked]="preference.get('songOnly')"
                         (change)="preference.get('songOnly', !preference.get('songOnly'))"
                         #songOnly>Song Only
        </md-slide-toggle>
	`,
	styles: ['md-slide-toggle {color: #868686;} md-slide-toggle.checked {color: #eee;}'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnChanges {
	@Input()
	preference: Preference;

	ngOnChanges() {
		this.preference.save();
	}
}
