import {AppComponent} from "./app.component";
import {DisplayComponent} from "./display/display.component";
import {ListComponent} from "./list/list.component";
import {TimerComponent} from "./timer/timer.component";
import {VisualSoundComponent} from "./visual-sound/visual-sound.component";
import {SettingsComponent} from "./settings/settings.component";


export const allComponents = [
	AppComponent,
	DisplayComponent,
	ListComponent,
	TimerComponent,
	VisualSoundComponent,
	SettingsComponent,
];

export const bootstrapComponent = AppComponent;
