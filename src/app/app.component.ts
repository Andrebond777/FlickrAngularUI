import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Photo } from './models/Photo';
import { SliderComponent } from './components/slider/slider.component';
import { FlickrUiService } from './services/flickr-ui.service';
import { Input } from '@angular/core';
import { createFlickr } from "flickr-sdk"
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})



export class AppComponent implements OnInit {
  title = 'Flickr';
  photos: Photo[] = [];

  

  @Input()
   isShow = false;
   @Input()
   isCorrect = false;
   @Input()
   score = 0;


  slider(sliderVal : number)
  {
    console.log("SFKDKJSJKDFDJGIHSFJA");
    this.score = Math.abs(this.score - this.photos[0].year);
    this.isShow = true;
    if(sliderVal != this.photos[0].year)
      this.isCorrect = false;
  }

  async reload(url: string): Promise<boolean> {
    await this.router.navigateByUrl('.', { skipLocationChange: true });
    return this.router.navigateByUrl(url);
  }

  next()
  {
    this.flickrUiService
    .getPhotos()
    .subscribe((result: Photo[]) => (this.photos = result));

    this.reload("")
  }


  constructor(private flickrUiService: FlickrUiService, public router:Router) {}

  ngOnInit(): void {
    this.flickrUiService
      .getPhotos()
      .subscribe((result: Photo[]) => (this.photos = result));
  }
}
