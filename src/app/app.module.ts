import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { SliderComponent } from './components/slider/slider.component';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { SettingsComponent } from './components/settings/settings.component';

import { FormsModule } from '@angular/forms';

import {NgToastModule} from 'ng-angular-popup'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SliderComponent,
    PinchZoomModule,
    FormsModule,
    NgToastModule,
    BrowserAnimationsModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoiYW5kcmVib25kNzc3IiwiYSI6ImNsdnlhdm00YjB2czgycW9nMzdxcndoa3UifQ.PfldMh8UJM0ZrfwlAFoUOQ', // Optional, can also be set per map (accessToken input of mgl-map)
    })
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
