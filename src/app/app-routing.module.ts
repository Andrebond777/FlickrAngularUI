import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SliderComponent } from './components/slider/slider.component';
import { AppComponent } from './app.component';


const routes: Routes = [
  {path: 'slider', component: SliderComponent},
  {path: 'app', component: AppComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
