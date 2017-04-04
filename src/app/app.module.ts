import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '@angular/material';

import {allComponents, bootstrapComponent} from './index';

import {AppService} from './services/app.service';

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
  ],
  bootstrap: [bootstrapComponent]
})
export class AppModule {
}
