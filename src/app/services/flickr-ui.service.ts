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

  public getPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${environment.apiUrl}/${this.url}`);
  }
  
}
