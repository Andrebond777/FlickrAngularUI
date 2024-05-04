import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

const defaultSearchStrings = [
  "Street view", "New York street view", "London street view", "Ukraine Street View", "City",
  "Grocery store", 
  "Historic moment", "World War II", "Hippie", "Parade", "Civil Rights Movement"
];

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  ngOnInit(): void {
  }

  @Input()
  searchStrings: string[] = [];
  @Input()
  str : string = "";

  storageKeySearchStrings : string = "searchStrings";

  addStr(){
    if(this.searchStrings.indexOf(this.str) == -1)
    {
      this.searchStrings.push(this.str);
    }
    this.str = "";
  }

  deleteStr(index : number){
    if(this.searchStrings.length > 1)
      this.searchStrings.splice(index, 1);
  }

  @Output() saveEvent = new EventEmitter<string[]>();

  onSubmit() {
    this.updateSearchStrings(this.searchStrings);
    //this.saveEvent.emit(this.searchStrings);
  }
  resetToDefault(){
    this.updateSearchStrings(defaultSearchStrings)
  }

  updateSearchStrings(searchStrs : string[])
  {
    const stringifiedSearchStrs = JSON.stringify(searchStrs); 
    localStorage.setItem(
      this.storageKeySearchStrings,
      stringifiedSearchStrs
    );
    window.location.reload();
  }
}
