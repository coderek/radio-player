import {Output, ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges} from "@angular/core";
import {Preference} from "../models/preference";

@Component({
	selector: 'app-settings',
	template: `
        <md-slide-toggle title="Start playing when the player launch."
                         [ngClass]="{checked: autoPlay.checked}"
                         [checked]="preference.get('autoPlay')"
                         (change)="onToggle.emit('autoStart')"
                         #autoPlay>
            Auto Play
        </md-slide-toggle>
        <md-slide-toggle title="Play random station from favorite list after every song." [color]="'warn'"
                         [ngClass]="{checked: playRandom.checked}"
                         [checked]="preference.get('playRandom')"
                         (change)="onToggle.emit('playRandom')"
                         #playRandom>Random
        </md-slide-toggle>
        <md-slide-toggle [color]="'primary'"
                         [ngClass]="{checked: songOnly.checked}"
                         title="Skip talkings."
                         [checked]="preference.get('songOnly')"
                         (change)="onToggle.emit('songOnly')"
                         #songOnly>Song Only
        </md-slide-toggle>
	`,
	styles: ['md-slide-toggle {color: #868686;} md-slide-toggle.checked {color: #eee;}'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnChanges {
	@Input()
	preference: Preference;

	@Output()
	onToggle: EventEmitter<string>;

	ngOnChanges() {
		console.log(arguments)
		// this.preference.save();
	}
}
