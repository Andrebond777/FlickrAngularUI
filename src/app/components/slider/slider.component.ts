
import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
/**
 * @title Configurable slider
 */
@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
  standalone: true,
  imports: [
    FormsModule
  ],
})
export class SliderComponent implements OnInit  {

  constructor() {
    this.min = Number(localStorage.getItem("minSliderVal"));
    this.max = Number(localStorage.getItem("maxSliderVal"));
    if(this.min == 0)
    {
      this.min = 1875;
      localStorage.setItem("minSliderVal", this.min.toString());
    }
    if(this.max == 0)
    {
      this.max = 2024;
      localStorage.setItem("maxSliderVal", this.max.toString());
    }
    this.sliderVal = (this.min+this.max)/2;
  }

   ngOnInit(): void {

  }

  
  @Input()
  min : number;
  @Input()
  max : number;
  @Input() 
  disabled = false;

  sliderVal : number;

  @Output() sliderEvent = new EventEmitter<number>();

  onSubmit() {
    
    this.disabled = true;
    this.sliderEvent.emit(this.sliderVal);

  }

}
