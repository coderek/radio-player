import {Output, ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges} from "@angular/core";

@Component({
	selector: 'app-settings',
	template: `
        <md-slide-toggle title="Start playing when the player launch."
                         [ngClass]="{checked: iPreference.get('autoPlay')}"
                         checked="iPreference.get('autoPlay')"
                         (change)="emit('autoPlay')"
                         #autoPlay>
            Auto Play
        </md-slide-toggle>
        <md-slide-toggle title="Play random station from favorite list after every song." [color]="'warn'"
                         [ngClass]="{checked: iPreference.get('playRandom')}"
                         checked="iPreference.get('playRandom')"
                         (change)="emit('playRandom')"
                         #playRandom>Random
        </md-slide-toggle>
        <md-slide-toggle [color]="'primary'"
                         [ngClass]="{checked: iPreference.get('songOnly')}"
                         title="Skip talkings."
                         checked="iPreference.get('songOnly')"
                         (change)="emit('songOnly')"
                         #songOnly>Song Only
        </md-slide-toggle>
	`,
	styles: ['md-slide-toggle {color: #868686;} md-slide-toggle.checked {color: #eee;}'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnChanges {
	@Input()
	iPreference;

	@Output()
	onToggle = new EventEmitter<string>();

	ngOnChanges() {
		// console.log(arguments)
		// this.iPreference.save();
	}
	emit(type) {
		setTimeout(()=>
		this.onToggle.emit(type),0)
	}
}
