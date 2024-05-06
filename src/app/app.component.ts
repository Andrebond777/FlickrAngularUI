import { Component } from '@angular/core';
import { Photo } from './models/Photo';
import { FlickrUiService } from './services/flickr-ui.service';
import confetti from 'canvas-confetti';
import { HttpResponse } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';

const defaultSearchStrings = [
  "Street view", "New York street view",  "City", "Grocery store"
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

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
  minYear = 0;
  maxYear = 0;

  toggleSettings()
  {
    this.displaySettings = !this.displaySettings;
  }

  getLimitedItems(startIndex: number, endIndex: number): Photo[] { 
    return this.photos.slice(startIndex, endIndex); 
  } 

  async slider(sliderVal : number)
  {
    this.score = Math.round(1000 - Math.abs(sliderVal - this.photos[this.roundNumber].year) * (5000 / (this.maxYear - this.minYear)));

    if(this.score < 0)
      this.score = 0;
    if(this.score > 900)
      this.celebrateCenter();
    this.scores.push(this.score);
    this.answers.push(sliderVal);
    this.totalScore += this.score;
    this.isShow = true;
  }

  async fetchPhotos(quantity : number)
  {
    if(this.searchStrings.length > 0)
    {
      await this.flickrUiService
      .getPhotos(quantity, this.searchStrings)
      .subscribe((result: HttpResponse<Photo[]>) => {   
          this.photos = this.photos.concat(result.body!);
      });
    }
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
        localStorage.setItem(this.storageKeyBestResult, this.totalScore.toString());
        this.celebrateLeft();
        this.celebrateRight();
        this.celebrateCenter();
        this.toast.success({detail:"You have beaten your previous best score!", duration: 10000, position:'botomCenter'});
      }
    }
    else
      localStorage.setItem(this.storageKeyBestResult, this.totalScore.toString());

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

  constructor(private flickrUiService: FlickrUiService, private toast : NgToastService) {
    const searchStringsFromStorage = localStorage.getItem(this.storageKeySearchStrings);
    if(searchStringsFromStorage != null)
    {
      const searchStringsFromStorageParsed = JSON.parse(searchStringsFromStorage);
      this.searchStrings = searchStringsFromStorageParsed;
    }
    else
      this.searchStrings = defaultSearchStrings;

    this.minYear = Number(localStorage.getItem("minYear"));
    this.maxYear = Number(localStorage.getItem("maxYear"));
    if(this.minYear == 0)
    {
      this.minYear = 1900;
      localStorage.setItem("minYear", this.minYear.toString());
    }
    if(this.maxYear == 0)
    {
      this.maxYear = 2024;
      localStorage.setItem("maxYear", this.maxYear.toString());
    }

    for(let i = 0; i < this.maxRoundNumber; i++)
      this.fetchPhotos(1);
    this.roundNumber++;
  }

  
   ngOnInit(): void {
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

  reloadPage(){
    window.location.reload();
  }
}
