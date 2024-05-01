import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Photo } from './models/Photo';
import { SliderComponent } from './components/slider/slider.component';
import { FlickrUiService } from './services/flickr-ui.service';
import { Input } from '@angular/core';
import { createFlickr } from "flickr-sdk"
import { Router } from '@angular/router';
import { CommonFunctionalityComponent } from './components/common-functionality/common-functionality.component';
import confetti from 'canvas-confetti';


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
  scores: number[] = [];
  answers: number[] = [];
  roundNumber = 0;
  maxRoundNumber = 5;
  displayAllRounds = false;
  storageKey = "bestResult";


  getLimitedItems(startIndex: number, endIndex: number): Photo[] { 
    return this.photos.slice(startIndex, endIndex); 
  } 


  totalScore = 0;

  @Input()
   isShow = false;
   @Input()
   score = 1;


  async slider(sliderVal : number)
  {
    this.score = Math.round(1000 - (Math.abs(sliderVal - this.photos[this.roundNumber].year))*40);
    if(this.score < 0)
      this.score = 1;
    if(this.score > 900)
      this.celebrateCenter();
    this.scores.push(this.score);
    this.answers.push(sliderVal);
    this.totalScore += this.score;
    this.isShow = true;
  }

  async fetchPhoto()
  {
      this.flickrUiService
      .getPhoto()
      .subscribe((result: Photo) => {   
          this.photos.push(result);
      });
  }

  
  sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  async next()
  {
    this.isShow = false;
    this.roundNumber++;
  }

  endGame()
  {
    this.displayAllRounds = true;
    let currentBestResult = localStorage.getItem(this.storageKey);
    console.log("currentBestResult: "+currentBestResult);
    if(currentBestResult != null)
    {      
      if(Number(currentBestResult) < Number(this.totalScore))
      {
        this.celebrateLeft();
        this.celebrateRight();
        this.celebrateCenter();
        localStorage.setItem(this.storageKey, this.totalScore.toString());
        console.log("set notNull");
      }
    }
    else
    {
      console.log("set null");
      localStorage.setItem(this.storageKey, this.totalScore.toString());
    }

    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

  getBestScore() : number
  {
    let bestScore = localStorage.getItem(this.storageKey);
    if(bestScore != null)
      return Number(bestScore)
    else
      return 1
  }

  constructor(private flickrUiService: FlickrUiService, public override router:Router) {
    super(router);
    for(let i = 0; i < this.maxRoundNumber; i++)
      this.fetchPhoto()
  }

  reloadCurrent(){
    this.reloadComponent(true);
  }

  reloadChild(){
    this.reloadComponent(false,"slider")
  }

  

  override ngOnInit(): void {
  }

  celebrateRight() {
    const duration = 5000; // in milliseconds
  
    confetti({
      particleCount: 200,
      spread: 400,
      origin: { y: 0.4, x: 0.8 },
    });
    
    // Clear confetti after a certain duration
    setTimeout(() => confetti.reset(), duration);
  }

  celebrateLeft() {
    const duration = 5000; // in milliseconds
  
    confetti({
      particleCount: 200,
      spread: 400,
      origin: { y: 0.4, x: 0.1 },
    });
    
    // Clear confetti after a certain duration
    setTimeout(() => confetti.reset(), duration);
  }

  celebrateCenter() {
    const duration = 3000; // in milliseconds
  
    confetti({
      particleCount: 100,
      spread: 400,
      origin: { y: 0.1 },
    });
    
    // Clear confetti after a certain duration
    setTimeout(() => confetti.reset(), duration);
  }
}
