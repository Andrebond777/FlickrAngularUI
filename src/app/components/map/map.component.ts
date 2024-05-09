import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { LngLat, Map, MapStyle, Marker, config, coordinates } from '@maptiler/sdk';

import '@maptiler/sdk/dist/maptiler-sdk.css';
import { Observable, Subscription } from 'rxjs';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map | undefined;

  isMarkerSet = false;
  isSubmitPressed = false;

  @Output() clickEvent = new EventEmitter<LngLat>();

  private requestValEventSubscription!: Subscription;
  @Input()
  requestValEvent!: Observable<LngLat>;

  @ViewChild('map')
private mapContainer!: ElementRef<HTMLElement>;

actualCoordinates : LngLat = new LngLat(0,0);

ngOnInit(): void {
  config.apiKey = 'VNEKnHOTnKmNJzR56tAq';
  this.requestValEventSubscription = this.requestValEvent.subscribe((data) => {this.actualCoordinates = data; this.onSubmit()});
}


  onSubmit!: Function;

ngAfterViewInit() {

  
  const initialState = { lng: 0, lat:30, zoom: 2 };

  this.map = new Map({
    container: this.mapContainer.nativeElement,
    style: MapStyle.STREETS,
    center: [initialState.lng, initialState.lat],
    zoom: initialState.zoom
  }); 

  var marker = new Marker({color: "#000000"});

  this.map.on('click',  (e) => {
      if(!this.isSubmitPressed)
      {
        marker.setLngLat(e.lngLat.wrap()).addTo(this.map!);
        if(this.isMarkerSet == false)
          this.onSubmit();
      }
  });

  this.onSubmit = function() {
    this.clickEvent.emit(marker.getLngLat());
    if(this.actualCoordinates.lat != 0 && this.actualCoordinates.lat != 0)
    {
      var actualMarker = new Marker({color: "#00de2c"});
      actualMarker.setLngLat(this.actualCoordinates).addTo(this.map!);
      this.isSubmitPressed = true;
      console.log("sfaadf", marker._lngLat.lng, marker._lngLat.lat);
      console.log("sfaadf", this.actualCoordinates.lng, this.actualCoordinates.lat);
      drawLine();
    }
  }  

  var drawLine = () =>{

      this.map!.addSource('lines', {
          'type': 'geojson',
          'data': {
              'type': 'FeatureCollection',
              'features': [
                  {
                      'type': 'Feature',
                      'properties': {
                          'color': '#000000'
                      },
                      'geometry': {
                          'type': 'LineString',
                          'coordinates': [
                              [marker._lngLat.lng, marker._lngLat.lat],
                              [this.actualCoordinates.lng, this.actualCoordinates.lat]
                          ]
                      }
                  },
              ]
          }
      });
      this.map!.addLayer({
          'id': 'lines',
          'type': 'line',
          'source': 'lines',
          'paint': {
              'line-width': 3,
              // Use a get expression (https://docs.maptiler.com/gl-style-specification/expressions/#get)
              // to set the line-color to a feature property value.
              'line-color': ['get', 'color']
          }
      });
  }

  this.map.getCanvas().style.cursor = 'crosshair';
}


ngOnDestroy() {
  this.map?.remove();
  this.requestValEventSubscription.unsubscribe();
}
}
