import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';

import {
  trigger, state, style, animate, transition, query, group
 } from '@angular/animations';

const defaultSearchStrings = [
  "Street view", "New York street view",  "City", "Grocery store"
];

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  animations: [
    trigger('animation', [
      transition(':enter', [
        style({ opacity: 0,  transform: 'translateY(-300px)' }),
        animate(350, style({ opacity: 1,  transform: 'translateY(0px)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(1000, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SettingsComponent implements OnInit {

  constructor(private toast : NgToastService){
    this.yearsSelection = this.getYearsSelection();
  }

      //show Toast on top center position
  displayErrorToast(message : string) {
    this.toast.error({detail:"Incorrect input!",summary:message, position:'botomCenter'});
  }

  ngOnInit(): void {
  }

  yearsSelection : Array<number> = [];
  @Input()
  searchStrings: string[] = [];
  @Input()
  str : string = "";

  displayRefreshPage = false;

  minYear = Number(localStorage.getItem("minYear"));
  maxYear = Number(localStorage.getItem("maxYear"));

  getYearsSelection() : Array<number>
  {
    let result: Array<number> = [];
    for(let i = 1830; i <= 2010; i+=10)
      result.push(i);
    return result;
  }

  updateYearRange(){
    if(this.minYear < 1830 || this.minYear > 2024 || this.maxYear < 1830 || this.maxYear > 2024)
      this.displayErrorToast('Year should be in the range from 1830 to 2024.');
    else if(this.minYear >= this.maxYear)
      this.displayErrorToast('Min year can not be greater or equal to Max year');
    else
    {
      localStorage.setItem("minYear", this.minYear.toString());
      localStorage.setItem("maxYear", this.maxYear.toString());
      this.toast.success({detail:"Successfully updated year range!",summary:'Changes will take place starting from the next game.', position:'botomCenter'});
      this.displayRefreshPage = true;
    }
  }

  storageKeySearchStrings : string = "searchStrings";

  addStr(){
    if(this.searchStrings.indexOf(this.str) == -1)
    {
      this.searchStrings.push(this.str);
      this.toast.success({detail:"Successfully added the search query!",summary:'Changes will take place starting from the next game.', position:'botomCenter'});
      this.updateSearchStrings(this.searchStrings);
      this.str = "";
      this.displayRefreshPage = true;
    }
    else
      this.toast.warning({detail:"Not added!",summary:'Provided search query already exists.', position:'botomCenter'});
  }

  deleteStr(index : number){
      this.searchStrings.splice(index, 1);
      this.updateSearchStrings(this.searchStrings);
      this.toast.success({detail:"Successfully deleted the search query!",summary:'Changes will take place starting from the next game.', position:'botomCenter'});
      this.displayRefreshPage = true;
  }

  deleteAllStrs()
  {
    this.searchStrings = [];
    this.updateSearchStrings(this.searchStrings);
    this.toast.success({detail:"Successfully deleted all search queries!",summary:'Changes will take place starting from the next game.', position:'botomCenter'});
  }

  resetToDefault(){
    this.minYear = 1900;
    this.maxYear = 2020;
    this.updateYearRange();

    this.searchStrings = defaultSearchStrings;
    this.updateSearchStrings(defaultSearchStrings)

    this.toast.success({detail:"Successfully reset to defaul search queries!",summary:'Changes will take place starting from the next game.', position:'botomCenter'});
    this.displayRefreshPage = true;
  }

  updateSearchStrings(searchStrs : string[])
  {
    const stringifiedSearchStrs = JSON.stringify(searchStrs); 
    localStorage.setItem(
      this.storageKeySearchStrings,
      stringifiedSearchStrs
    );
  }

  reloadPage(){
    window.location.reload();
  }
}
