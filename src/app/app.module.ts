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
import { MapComponent } from './components/map/map.component';
import { ImageComponent } from './components/image/image.component';



@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    MapComponent,
    ImageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SliderComponent,
    PinchZoomModule,
    FormsModule,
    NgToastModule,
    BrowserAnimationsModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
