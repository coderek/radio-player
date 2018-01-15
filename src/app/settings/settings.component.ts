import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {RadioService} from "../services/radio.service";
import {Record} from "immutable";

@Component({
	selector: 'app-settings',
	template: `
        <md-slide-toggle title="Start playing when the player launch."
                         [ngClass]="{checked: autoPlay.checked}"
                         (change)="update('autoPlay', autoPlay.checked)"
                         #autoPlay>
            Auto Play
        </md-slide-toggle>
        <md-slide-toggle title="Play random station from favorite list after every song." [color]="'warn'"
                         [ngClass]="{checked: playRandom.checked}"
                         (change)="update('playRandom', playRandom.checked)"
                         #playRandom>Random
        </md-slide-toggle>
        <md-slide-toggle [color]="'primary'"
                         title="Skip talkings."
                         [ngClass]="{checked: songOnly.checked}"
                         (change)="update('songOnly', songOnly.checked)"
                         #songOnly>Song Only
        </md-slide-toggle>
	`,
	styles: [`
		md-slide-toggle {color: #868686;} 
		md-slide-toggle.checked {color: #eee;}  
		:host {
			padding: 0 10px;
	    }
	`],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
	// @Input()
	// preference:Record<string, any>;

	constructor(private radioService: RadioService) {
	}

	update(key, val) {
		this.radioService.updatePreference(key, val);
	}
}
