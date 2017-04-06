import {
	Output, ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges,
	ApplicationRef, SimpleChanges, ChangeDetectorRef
} from "@angular/core";

@Component({
	selector: 'app-settings',
	template: `
        <md-slide-toggle title="Start playing when the player launch."
                         [checked]="iPreference.get('autoPlay')"
                         [ngClass]="{checked: autoPlay.checked}"
                         (change)="emit('autoPlay', autoPlay.checked)"
                         #autoPlay>
            Auto Play
        </md-slide-toggle>
        <md-slide-toggle title="Play random station from favorite list after every song." [color]="'warn'"
                         [ngClass]="{checked: playRandom.checked}"
                         [checked]="iPreference.get('playRandom')"
                         (change)="emit('playRandom', playRandom.checked)"
                         #playRandom>Random
        </md-slide-toggle>
        <md-slide-toggle [color]="'primary'"
                         title="Skip talkings."
                         [checked]="iPreference.get('songOnly')"
                         [ngClass]="{checked: songOnly.checked}"
                         (change)="emit('songOnly', songOnly.checked)"
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
export class SettingsComponent implements OnChanges {
	@Input()
	iPreference;

	@Output()
	onToggle = new EventEmitter<any>();

	constructor(private ref: ChangeDetectorRef) {

	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['iPreference'].firstChange) {
			// [ngClass] attribute need to be updated after [check]
			setTimeout(()=>this.ref.detectChanges(), 0);
		}
	}
	emit(key, val) {
		this.onToggle.emit({key, val});
	}
}
