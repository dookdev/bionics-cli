import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url: String = environment.apiUrl;

  constructor(public http: HttpClient) {

  }

  private header() {
    const header = new HttpHeaders();
    // header.set('Authorization', 'token');
    return header;
  }

  get(route: string) {
    return this.http.get(this.url + route, { headers: this.header() }).toPromise();
  }

  post(route: string, Body: any) {
    return this.http.post(this.url + route, Body, { headers: this.header() }).toPromise();
  }

  put(route: string, Body: any) {
    return this.http.put(this.url + route, Body, { headers: this.header() }).toPromise();
  }

  delete(route: string) {
    return this.http.delete(this.url + route, { headers: this.header() }).toPromise();
  }
}
