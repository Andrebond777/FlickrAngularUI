
import {Component, Output, EventEmitter, Input, ViewChild, OnInit} from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import { AppComponent } from '../../app.component';
import { Router } from '@angular/router';
import { CommonFunctionalityComponent } from '../common-functionality/common-functionality.component';


/**
 * @title Configurable slider
 */
@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatSliderModule
  ],
})
export class SliderComponent  extends CommonFunctionalityComponent implements OnInit  {

  constructor(public override router:Router) {
    super(router);
  }

  override ngOnInit(): void {
  }

  min = 1875;
  max = 2024;

  step = 1;
  @Input() disabled = false;
  sliderVal = 1950;
  

  @Output() sliderEvent = new EventEmitter<number>();

  reloadCurrent(){
    this.reloadComponent(true);
  }

  onSubmit() {
    
    this.disabled = true;
    this.sliderEvent.emit(this.sliderVal);

  }

}
