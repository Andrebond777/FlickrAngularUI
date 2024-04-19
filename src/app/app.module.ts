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

@NgModule({
  declarations: [
    AppComponent,
    CommonFunctionalityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatSliderModule,
    SliderComponent,
    PinchZoomModule

  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
