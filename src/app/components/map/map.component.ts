import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { LngLat, Map, MapStyle, Marker, config, coordinates } from '@maptiler/sdk';

import '@maptiler/sdk/dist/maptiler-sdk.css';
import { Observable, Subscription } from 'rxjs';

import haversine from 'haversine-distance'
import { environment } from '../../../environments/environment';


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

@Input()
actualCoordinates : LngLat = new LngLat(0,0);

@Input()
inputCoordinates : LngLat = new LngLat(0,0);

onSubmit!: Function;
display!: Function;

ngOnInit(): void {
  config.apiKey = environment.mapApiKey;

  if(this.inputCoordinates != null)
    this.display();
  else
    this.requestValEventSubscription = this.requestValEvent.subscribe((data) => {this.actualCoordinates = data; this.onSubmit()});
}




ngAfterViewInit() {

  
  const initialState = { lng: 0, lat:30, zoom: 2 };

  this.map = new Map({
    container: this.mapContainer.nativeElement,
    style: MapStyle.STREETS,
    center: [initialState.lng, initialState.lat],
    zoom: initialState.zoom,
    fullscreenControl: true
  }); 

  var marker = new Marker({color: "#ff0000"});
  if(this.inputCoordinates  != null)
    marker.setLngLat(this.inputCoordinates);

  this.map.on('click',  (e) => {
      if(!this.isSubmitPressed)
      {
        marker.setLngLat(e.lngLat.wrap()).addTo(this.map!);
        if(this.isMarkerSet == false)
          this.onSubmit();
      }
  });

  this.display = function() {
    if(this.actualCoordinates.lat != 0 && this.actualCoordinates.lng != 0)
    {
      var actualMarker = new Marker({color: "#00c206"});
      actualMarker.setLngLat(this.actualCoordinates).addTo(this.map!);
      this.isSubmitPressed = true;

      drawLine();

      var distanceContainer = document.getElementById('distance');
      distanceContainer!.innerHTML = '';
      var haversine_m = haversine(marker._lngLat, this.actualCoordinates); //Results in meters (default)
      var haversine_km = Math.floor(haversine_m /1000); //Results in kilometers
      var value = document.createElement('pre');
      value.textContent = "You were off by: " + haversine_km + "km"
      distanceContainer!.appendChild(value);
      let zoom = 5;
      if(haversine_km < 5000)
      {
        zoom -= Math.floor(Math.abs(marker._lngLat.lng-this.actualCoordinates.lng) / 10);
        zoom -= Math.floor(Math.abs(marker._lngLat.lat-this.actualCoordinates.lat) / 20);
      }
      else if(haversine_km < 10000)
        zoom = 3;
      else if(haversine_km < 20000)
        zoom = 2;
      else if(haversine_km >= 20000)
        zoom = 1;
      if(zoom<0)
        zoom = 1;

      this.map!.setZoom(zoom);
      // value.textContent = "lng = " + Math.floor(Math.abs(marker._lngLat.lng-this.actualCoordinates.lng) / 10)
      // + " lat = " + Math.floor(Math.abs(marker._lngLat.lat-this.actualCoordinates.lat) / 5)
      // + " zoom = " + zoom;

      this.map!.setCenter([(marker._lngLat.lng+this.actualCoordinates.lng)/2, (marker._lngLat.lat+this.actualCoordinates.lat)/2]);

    }
  }

  this.onSubmit = function() {
    this.clickEvent.emit(marker.getLngLat());
    this.display();
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
                          'color': 'rgb(82, 82, 82)'
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
