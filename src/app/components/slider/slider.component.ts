
import {Component, Output, EventEmitter, Input, ViewChild, OnInit} from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import { AppComponent } from '../../app.component';
import { Router } from '@angular/router';

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
export class SliderComponent implements OnInit {

  constructor(public router:Router) {}

  ngOnInit(): void {
  }

  max = 2024;
  min = 1900;
  step = 1;
  @Input() disabled = false;
  @Input() sliderVal = 1960;

  @Output() sliderEvent = new EventEmitter<number>();
  

  onSubmit() {
    this.disabled = true;
    console.log(this.sliderVal);
      this.sliderEvent.emit(this.sliderVal);
  }
}
