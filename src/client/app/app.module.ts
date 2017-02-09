import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultComponent } from './components/default.component';
/**
 * Uncomment this for the workaround. Note that for @ngtools/webpack versions
 * 1.2.6-1.2.8 you'll also need to comment out lines 229-231 of:
 *
 * /node_modules/@ngtools/webpack/src/plugin.js
 *
declare var System: any;
function DummyObject() {
  this.f = {};
  System.import(this.f.a + this.f.b);
}
  */

@NgModule({
  imports: [BrowserModule, AppRoutingModule],
  declarations: [AppComponent, DefaultComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}