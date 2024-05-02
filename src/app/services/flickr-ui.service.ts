import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';
import { Photo } from '../models/Photo';

@Injectable({
  providedIn: 'root'
})
export class FlickrUiService {

  private url = 'Flickr';

  constructor(private http: HttpClient) {}

  public getPhotos(quantity : number): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${environment.apiUrl}/${this.url}/GetImages?quantity=${quantity}&randomValueToAvoidCachingInSafari=`+Math.random());
  }

  public getYear(webUrl : String): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/${this.url}/GetYears?webUrl=${webUrl}&randomValueToAvoidCachingInSafari=`+Math.random());
  }
  
}
