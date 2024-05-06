import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';

const defaultSearchStrings = [
  "Street view", "New York street view", "Tokyo street view", "Ukraine street View", "City",
  "Grocery store", "Historic moment", "World War II", "Parade"
];

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {

  constructor(private toast : NgToastService){

  }

      //show Toast on top center position
  displayErrorToast(message : string) {
    this.toast.error({detail:"Incorrect input!",summary:message, position:'topRight'});
  }

  ngOnInit(): void {
  }

  @Input()
  searchStrings: string[] = [];
  @Input()
  str : string = "";

  displayRefreshPage = false;

  minSliderVal = Number(localStorage.getItem("minSliderVal"));
  maxSliderVal = Number(localStorage.getItem("maxSliderVal"));

  updateSliderVals(){
    if(this.minSliderVal < 1830 || this.minSliderVal > 2024 || this.maxSliderVal < 1830 || this.maxSliderVal > 2024)
      this.displayErrorToast('Year should be in the range from 1830 to 2024.');
    else if(this.minSliderVal > this.maxSliderVal)
      this.displayErrorToast('Min year can not be greater or equal to Max year');
    else
    {
      localStorage.setItem("minSliderVal", this.minSliderVal.toString());
      localStorage.setItem("maxSliderVal", this.maxSliderVal.toString());
      this.toast.success({detail:"Successfully updated year range!",summary:'Changes will take place starting from the next game.', position:'topRight'});
      this.displayRefreshPage = true;
    }
  }

  storageKeySearchStrings : string = "searchStrings";

  addStr(){
    if(this.searchStrings.indexOf(this.str) == -1)
    {
      this.searchStrings.push(this.str);
      this.toast.success({detail:"Successfully added the search query!",summary:'Changes will take place starting from the next game.', position:'topRight'});
      this.updateSearchStrings(this.searchStrings);
      this.str = "";
      this.displayRefreshPage = true;
    }
    else
      this.toast.warning({detail:"Not added!",summary:'Provided search query already exists.', position:'topRight'});
  }

  deleteStr(index : number){
      this.searchStrings.splice(index, 1);
      this.toast.success({detail:"Successfully deleted the search query!",summary:'Changes will take place starting from the next game.', position:'topRight'});
      this.displayRefreshPage = true;
  }

  deleteAllStrs()
  {
    this.searchStrings = [];
    this.updateSearchStrings(this.searchStrings);
    this.toast.success({detail:"Successfully deleted all search queries!",summary:'Changes will take place starting from the next game.', position:'topRight'});
    this.displayRefreshPage = true;
  }

  resetToDefault(){
    this.searchStrings = defaultSearchStrings;
    this.updateSearchStrings(defaultSearchStrings)
    this.toast.success({detail:"Successfully reset to defaul search queries!",summary:'Changes will take place starting from the next game.', position:'topRight'});
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
