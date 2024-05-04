
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
  }

   ngOnInit(): void {
  }


  min = 1875;
  max = 2024;

  step = 1;
  @Input() disabled = false;
  sliderVal = 1950;
  @Input() disableButton: boolean = false;

  @Output() sliderEvent = new EventEmitter<number>();

  onSubmit() {
    
    this.disabled = true;
    this.sliderEvent.emit(this.sliderVal);

  }

}
