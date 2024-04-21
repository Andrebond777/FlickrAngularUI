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

  calculateColor(score : number)
  {
    score = Math.round(2.55*score);
    let r : string | number = 0;
    let g : string | number = 0;
    if(score > 1275)
    {
      r =  2*(127 - (score - 1275)/10);
      g = 255;
    }
    else
    {
      r = 255;
      g = (score)/5;
    }
    let colorVal = `rgb(${r}, ${g}, 0)`;
    console.log(score, colorVal);
    return colorVal;
  }

  getColor(score : number)
  {
    return {'color': this.calculateColor(score)};
  }

  getAccentColor(score : number)
  {
      return {'accent-color': this.calculateColor(score)};
  }

  title = 'Flickr';
  @Input()
  photo = new Photo();
  photos : Photo[] = [];
  displayedPhotos : Photo[] = [];
  scores: number[] = [];
  answers: number[] = [];
  roundNumber = -1;
  maxRoundNumber = 5;
  displayAllRounds = false;


  getLimitedItems(startIndex: number, endIndex: number): Photo[] { 
    return this.photos.slice(startIndex, endIndex); 
  } 


  totalScore = 0;

  @Input()
   isShow = false;
   @Input()
   score = 1;


  slider(sliderVal : number)
  {
    console.log("SFKDKJSJKDFDJGIHSFJA");
    this.score = Math.round(1000 - (Math.abs(sliderVal - this.displayedPhotos[this.roundNumber].year))*50);
    if(this.score < 0)
      this.score = 0;
    this.scores.push(this.score);
    this.answers.push(sliderVal);
    this.totalScore += this.score;
    this.isShow = true;
  }

  fetchPhoto()
  {
      this.flickrUiService
      .getPhoto()
      .subscribe((result: Photo) => {
        if(result.image.length > 1)
        {        
          this.photo = result;
          this.photos.push(this.photo);
          if(this.roundNumber == -1)
          {          
            this.displayedPhotos.push(this.photos[0]);
            this.roundNumber++;
            this.photos.shift();
          }
        }
        else
          this.fetchPhoto();
      });
  }


  async next()
  {
    this.isShow = false;

      this.displayedPhotos.push(this.photos[0]);

    this.roundNumber++;
    this.photos.shift();
  }

  endGame()
  {
    this.displayAllRounds = true;
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
});
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

    for(let i = 0; i < this.maxRoundNumber; i++)
      this.fetchPhoto()
  }
}
