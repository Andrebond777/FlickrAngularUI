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

  public sga(quantity : number, searchStrings : string[]): Observable<Photo[]> {
    let queryStr = "";
    for(let i = 0; i < searchStrings.length; i++)
      queryStr += "&searchStrings=" + searchStrings[i];

      var headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
      let json = JSON.stringify(searchStrings);
    return this.http.request<Photo[]>("GET",`${environment.apiUrl}/GetImages/quantity=${quantity}`, {body : {json}});
  }

  getPhotos(quantity : number, searchStrings : string[]): Observable<HttpResponse<Photo[]>> {
    let body = JSON.stringify(searchStrings);
    let response =  this.http.post<Photo[]>(`${environment.apiUrl}/GetImages/${quantity}`, body,
            {
                headers : new HttpHeaders({"Content-Type": "application/json"}),
                observe: 'response',
                responseType:'json'
            });
    return response;
  }

  public getYear(webUrl : string): Observable<number> {
    webUrl = encodeURIComponent(webUrl);
    return this.http.get<number>(`${environment.apiUrl}/GetYear/${webUrl}`);
  }
  
}
