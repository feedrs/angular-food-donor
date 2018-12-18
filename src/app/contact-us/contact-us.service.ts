import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { shareReplay } from 'rxjs/operators';

const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(public http: HttpClient) {
  }

  create(data: any) {
    console.log(data);
    const shared = this.http.post(`/contact-us`, JSON.stringify(data), config).pipe(
      shareReplay(),
    );

    shared.subscribe((data: any) => {
      console.log(data);
      // this.dataStore.stocks.push(data);
      // this._stocks.next(Object.assign({}, this.dataStore).stocks);
    }, error => console.log('Could not create contact.'));

    return shared;
  }
}
