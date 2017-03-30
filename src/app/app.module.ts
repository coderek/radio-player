import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {DisplayComponent} from "./display/display.component";
import {ListComponent} from "./list/list.component";
import {TimerComponent} from "./timer/timer.component";
import {VisualSoundComponent} from "./visual-sound/visual-sound.component";

@NgModule({
  declarations: [
    AppComponent,
    DisplayComponent,
    ListComponent,
    TimerComponent,
    VisualSoundComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
