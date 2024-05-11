import { Component, EventEmitter, Output } from '@angular/core';
import { Photo } from './models/Photo';
import { FlickrUiService } from './services/flickr-ui.service';
import confetti from 'canvas-confetti';
import { HttpResponse } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';

import { LngLat } from '@maptiler/sdk';
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

  getSumColor()
  {
    console.log(this.roundNumber);
    console.log(this.yearScores[this.roundNumber]);
    console.log(this.geoScores[this.roundNumber]);
    let score = 0;
    if(this.enableYear)
      score += this.yearScores[this.roundNumber];
    if(this.enableGeo)
      score += this.geoScores[this.roundNumber];
    if(this.enableYear && this.enableGeo)
      score /= 2;
    return this.getColor(score);
  }

  getAccentColor(score : number)
  {
      return {'accent-color': this.calculateColor(score)};
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'instant'});
  }

  isImgFullScreen = false;
  title = 'Flickr';
  // @Input()
  // photo = new Photo();
  photos : Photo[] = [];
  yearScores: number[] = [];
  geoScores: number[] = [];
  answers: number[] = [];
  answerMarkers: LngLat[] = [];
  actualMarkers: LngLat[] = [];
  searchStrings: string[] = [];
  roundNumber = -1;
  maxRoundNumber = 2;
  coordinates : LngLat = new LngLat(0, 0);
  isMarkerSet = false;
  totalScore = 0;
  isShow = false;
  displayAllRounds = false;
  displaySettings = false;
  storageKeyBestResult = "bestResult";
  storageKeySearchStrings = "searchStrings";
  minYear = 0;
  maxYear = 0;
  enableYear : boolean = JSON.parse(localStorage.getItem("enableYear")!);
  enableGeo : boolean = JSON.parse(localStorage.getItem("enableGeo")!);


  @Output() requestYearValues = new EventEmitter<void>();
  @Output() requestGeoValues = new EventEmitter<LngLat>();

  toggleSettings()
  {
    this.displaySettings = !this.displaySettings;
  }

  getLimitedItems(startIndex: number, endIndex: number): Photo[] { 
    return this.photos.slice(startIndex, endIndex); 
  } 


  onSubmit(){
    
    if(this.enableGeo)
    {
      if(this.isMarkerSet)
      {
        let actualMarker = new LngLat(this.photos[this.roundNumber].longtitude, this.photos[this.roundNumber].latitude);
        this.requestGeoValues.emit(actualMarker);
        this.actualMarkers.push(actualMarker);
        this.isMarkerSet = false;
      }
      else
      {
        this.toast.error({detail:"Please, select location!", duration: 1000, position:'botomCenter'});
        return;
      }
    }
    if(this.enableYear)
      this.requestYearValues.emit();
    this.isShow = true;
    //window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
  }

  calculateGeoScore(marker : LngLat)
  {
    if(marker)
    {
      if(this.isMarkerSet == false)
        this.isMarkerSet = true;
      else
      {
        let geoScore = 1;
        geoScore = Math.round(1000 - 20 * (Math.abs(marker.lat - this.photos[this.roundNumber].latitude) 
                                   + Math.abs(marker.lng - this.photos[this.roundNumber].longtitude)));
        if(geoScore < 0)
          geoScore = 0;
        this.geoScores.push(geoScore);
        this.totalScore += geoScore / (this.enableGeo && this.enableYear ? 2 : 1);
        this.answerMarkers.push(marker);
      }
    }
  }

  async calculateYearScore(sliderVal : number)
  {
    let yearScore = 1;
    yearScore = Math.round(1000 - Math.abs(sliderVal - this.photos[this.roundNumber].year) * (5000 / (this.maxYear - this.minYear)));

    if(yearScore < 0)
      yearScore = 0;
    this.yearScores.push(yearScore);
    this.answers.push(sliderVal);
    this.totalScore += yearScore / (this.enableGeo && this.enableYear ? 2 : 1);
  }

  async fetchPhotos(quantity : number)
  {
    if(this.searchStrings.length > 0)
    {
      await this.flickrUiService
      .getPhotos(true, quantity, this.searchStrings)
      .subscribe((result: HttpResponse<Photo[]>) => {   
          this.photos = this.photos.concat(result.body!);
      });
    }
  }
  
  sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  async next()
  {
    this.isImgFullScreen = false;
    this.isShow = false;
    this.roundNumber++;
  }

  endGame()
  {
    this.displayAllRounds = true;
    this.isImgFullScreen = false;
    let currentBestResult = localStorage.getItem(this.storageKeyBestResult);
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

    // let topCities : string[] = [];    
    // let obj  = topCitiesJSON.entries();
    // for (const iterator of obj) 
    //   topCities.push(iterator[1].city);
    // topCities.push("Ukraine");
    // for (const iterator of topCities) {
    //   console.log(iterator);
    // }
    //this.searchStrings = topCities;
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
      this.maxYear = 2020;
      localStorage.setItem("maxYear", this.maxYear.toString());
    }
    if(this.enableYear == null)
      localStorage.setItem("enableYear", "true");
    if(this.enableGeo == null)
      localStorage.setItem("enableGeo", "true");

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
