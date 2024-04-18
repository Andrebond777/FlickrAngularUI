import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Photo } from './models/Photo';
import { SliderComponent } from './components/slider/slider.component';
import { FlickrUiService } from './services/flickr-ui.service';
import { Input } from '@angular/core';
import { createFlickr } from "flickr-sdk"
import { Router } from '@angular/router';
import { CommonFunctionalityComponent } from './components/common-functionality/common-functionality.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})



export class AppComponent  extends CommonFunctionalityComponent {
  title = 'Flickr';
  @Input()
  photo = new Photo();
  photos : Photo[] = [];

  

  @Input()
   isShow = false;
   @Input()
   isCorrect = false;
   @Input()
   score = 0;


  slider(sliderVal : number)
  {
    console.log("SFKDKJSJKDFDJGIHSFJA");
    this.score = Math.round(2000 / (Math.abs(sliderVal - this.photo.year)+1));
    this.isShow = true;
    if(sliderVal != this.photo.year)
      this.isCorrect = false;
  }

  fetchPhoto()
  {
      this.flickrUiService
      .getPhoto()
      .subscribe((result: Photo) => {
        this.photo = result;
        this.photos.push(this.photo);
      });
  }


  next()
  {
    this.isShow = false;
    this.fetchPhoto()
  }


  constructor(private flickrUiService: FlickrUiService, public override router:Router) {
    super(router);
    console.log("Inside AppComponent Constructor");
  }

  reloadCurrent(){
    this.reloadComponent(true);
  }

  reloadChild(){
    this.reloadComponent(false,"slider")
  }

  override ngOnInit(): void {
    this.fetchPhoto()
  }
}
