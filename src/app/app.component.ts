import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Photo } from './models/Photo';
import { SliderComponent } from './components/slider/slider.component';
import { FlickrUiService } from './services/flickr-ui.service';
import { Input } from '@angular/core';
import { createFlickr } from "flickr-sdk"
import { Router } from '@angular/router';
import { CommonFunctionalityComponent } from './components/common-functionality/common-functionality.component';
import confetti from 'canvas-confetti';

const defaultSearchStrings = [
  "street view", "grocery store", "historic moment", "city", 
  "World War II", "HippieCulture", "DiscoEra", "parade", 
  "CivilRightsMovement", "harbor"
];

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
  // @Input()
  // photo = new Photo();
  photos : Photo[] = [];
  scores: number[] = [];
  answers: number[] = [];
  searchStrings: string[] = [];
  roundNumber = -1;
  maxRoundNumber = 5;
  score = 1;
  totalScore = 0;
  isShow = false;
  displayAllRounds = false;
  displaySettings = false;
  storageKeyBestResult = "bestResult";
  storageKeySearchStrings = "searchStrings";

  toggleSettings()
  {
    this.displaySettings = !this.displaySettings;
  }

  getLimitedItems(startIndex: number, endIndex: number): Photo[] { 
    return this.photos.slice(startIndex, endIndex); 
  } 

  async slider(sliderVal : number)
  {
    if(this.roundNumber < 1)
    {
      await this.fetchPhotos(1);
      await this.fetchPhotos(1);
      await this.fetchPhotos(1);
    }

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

  async fetchPhotos(quantity : number)
  {
      await this.flickrUiService
      .getPhotos(quantity, this.searchStrings)
      .subscribe((result: Array<Photo>) => {   
          this.photos = this.photos.concat(result);
          for(let i = 1; i <= quantity; i++)
          {
            this.fetchYears(this.photos.length - i);
          }
      });
  }

  async fetchYears(index : number)
  {
      await this.flickrUiService
      .getYear(this.photos[index].webUrl)
      .subscribe((result: number) => {
        this.photos[index].year = result;
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
    let currentBestResult = localStorage.getItem(this.storageKeyBestResult);
    console.log("currentBestResult: "+currentBestResult);
    if(currentBestResult != null)
    {      
      if(Number(currentBestResult) < Number(this.totalScore))
      {
        this.celebrateLeft();
        this.celebrateRight();
        this.celebrateCenter();
        localStorage.setItem(this.storageKeyBestResult, this.totalScore.toString());
        console.log("set notNull");
      }
    }
    else
    {
      console.log("set null");
      localStorage.setItem(this.storageKeyBestResult, this.totalScore.toString());
    }

    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

  getBestScore() : number
  {
    let bestScore = localStorage.getItem(this.storageKeyBestResult);
    if(bestScore != null)
      return Number(bestScore)
    else
      return 1
  }

  modifySearchStrings(searchStrs : string[])
  {
    const stringifiedSearchStrs = JSON.stringify(searchStrs); 
    localStorage.setItem(
      this.storageKeySearchStrings,
      stringifiedSearchStrs
    );
  }

  constructor(private flickrUiService: FlickrUiService, public override router:Router) {
    super(router);
    const searchStringsFromStorage = localStorage.getItem(this.storageKeySearchStrings);
    if(searchStringsFromStorage != null)
    {
      const searchStringsFromStorageParsed = JSON.parse(searchStringsFromStorage);
      this.searchStrings = searchStringsFromStorageParsed;
    }
    else
      this.searchStrings = defaultSearchStrings;

    this.fetchPhotos(1);
    this.roundNumber++;
    this.fetchPhotos(1);
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
