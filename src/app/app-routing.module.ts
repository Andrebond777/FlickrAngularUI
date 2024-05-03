import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SliderComponent } from './components/slider/slider.component';
import { AppComponent } from './app.component';
import { SettingsComponent } from './components/settings/settings.component';


const routes: Routes = [
  {path: 'slider', component: SliderComponent},
  {path: 'app', component: AppComponent},
  {path: 'settings', component: SettingsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
