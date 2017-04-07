import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MaterialModule} from "@angular/material";

import {allComponents, bootstrapComponent} from "./index";

import {AppService} from "./services/app.service";
import {AudioService} from "./services/audio.service";
import {RadioService} from "./services/radio.service";
import {WebSocketService} from "./services/websocket.service";

@NgModule({
	declarations: allComponents,
	imports: [
		BrowserModule,
		HttpModule,
		BrowserAnimationsModule,
		MaterialModule,
	],
	providers: [
		AppService,
		AudioService,
		RadioService,
		WebSocketService,
	],
	bootstrap: [bootstrapComponent]
})
export class AppModule {
}
