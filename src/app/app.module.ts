import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import {MatSliderModule} from '@angular/material/slider';
import { SliderComponent } from './components/slider/slider.component';
import { CommonFunctionalityComponent } from './components/common-functionality/common-functionality.component';
import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { SettingsComponent } from './components/settings/settings.component';
import {MatListModule} from '@angular/material/list'; 

import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';


@NgModule({
  declarations: [
    AppComponent,
    CommonFunctionalityComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatSliderModule,
    SliderComponent,
    PinchZoomModule,
    MatListModule,
    FormsModule,
    ScrollingModule

  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
