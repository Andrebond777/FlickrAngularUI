import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

const defaultSearchStrings = [
  "street view", "grocery store", "historic moment", "city", 
  "World War II", "HippieCulture", "DiscoEra", "parade", 
  "CivilRightsMovement", "harbor"
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
      this.searchStrings.push(this.str);
  }

  deleteStr(index : number){
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
