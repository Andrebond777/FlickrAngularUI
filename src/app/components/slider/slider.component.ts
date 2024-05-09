
import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
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
    this.min = Number(localStorage.getItem("minYear"));
    this.max = Number(localStorage.getItem("maxYear"));
    this.sliderVal = Math.round((this.min+this.max)/2);
  }

   ngOnInit(): void {
    this.requestValEventSubscription = this.requestValEvent.subscribe(() => this.onSubmit());
  }
  ngOnDestroy() {
    this.requestValEventSubscription.unsubscribe();
  }
  
  
  @Input()
  min : number;
  @Input()
  max : number;
  @Input() 
  disabled = false;
  private requestValEventSubscription!: Subscription;
  @Input()
  requestValEvent!: Observable<void>;

  sliderVal : number;

  @Output() sliderEvent = new EventEmitter<number>();

  onSubmit() {
    
    this.disabled = true;
    this.sliderEvent.emit(this.sliderVal);

  }

}
