import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';
import { Photo } from '../models/Photo';

@Injectable({
  providedIn: 'root'
})
export class FlickrUiService {

  private url = '';

  constructor(private http: HttpClient) {}
  getPhotos(quantity : number, searchStrings : string[]): Observable<HttpResponse<Photo[]>> {
    let body = JSON.stringify(searchStrings);
    let minYear = Number(localStorage.getItem("minYear"));
    let maxYear = Number(localStorage.getItem("maxYear"));
    let response =  this.http.post<Photo[]>(`${environment.apiUrl}/GetImages/${quantity}/${minYear}/${maxYear}`, body,
            {
                headers : new HttpHeaders({"Content-Type": "application/json"}),
                observe: 'response',
                responseType:'json'
            });
    return response;
  }
}
