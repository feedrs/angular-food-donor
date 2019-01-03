import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { map, filter, flatMap, catchError, shareReplay } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';
import { Donor } from '@app/model/donor';
import { Stock } from '@app/model/stock';


const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };

@Injectable({
  providedIn: 'root'
})
export class DonorService {

  donors: Observable<Donor[]>;
  private _donors: BehaviorSubject<Donor[]>;

  stocks: Observable<Stock[]>;
  private _stocks: BehaviorSubject<Stock[]>;

  nostocks: Observable<Stock[]>;
  private _nostocks: BehaviorSubject<Stock[]>;

  lowstocks: Observable<Stock[]>;
  private _lowstocks: BehaviorSubject<Stock[]>;

  wellstocks: Observable<Stock[]>;
  private _wellstocks: BehaviorSubject<Stock[]>;

  private dataStore: {
    donors: Donor[],
    stocks: Stock[],
    wellstocks: Stock[],
    lowstocks: Stock[],
    nostocks: Stock[],
  };

  constructor(public http: HttpClient) {

    this.dataStore = { donors: [], stocks: [], wellstocks: [], lowstocks: [], nostocks: []};
    this._donors = <BehaviorSubject<Donor[]>>new BehaviorSubject([]);
    this.donors = this._donors.asObservable();

    this._stocks = <BehaviorSubject<Stock[]>>new BehaviorSubject([]);
    this.stocks = this._stocks.asObservable();

    this._nostocks = <BehaviorSubject<Stock[]>>new BehaviorSubject([]);
    this.nostocks = this.stocks.pipe(
      map((data) => data.filter(data => (data.quantity <= 10 && data.quantity > 0) ))
    );

    this._lowstocks = <BehaviorSubject<Stock[]>>new BehaviorSubject([]);
    this.lowstocks = this.stocks.pipe(
      map((data) => data.filter(data => (data.quantity <= 20 && data.quantity >= 11) ))
    );

    this._wellstocks = <BehaviorSubject<Stock[]>>new BehaviorSubject([]);
    this.wellstocks = this.stocks.pipe(
      map((data) => data.filter(data => data.quantity >= 21 ))
    );
  }

  loadAll() {
    this.http.get<Donor[]>("/donor")
      .subscribe(data => {
        console.log(data);
        this.dataStore.donors = data;
        this._donors.next(Object.assign({}, this.dataStore).donors);
      }, error => console.log('Error, could not load donor'));
  }

  loadAllStock() {
    this.http.get<Stock[]>("/stock")
      .subscribe(data => {
        console.log(data);
        this.dataStore.stocks = data;
        this._stocks.next(Object.assign({}, this.dataStore).stocks);
      }, error => console.log('Error, could not load stocks'));
  }

  create(data: any) {
    const shared = this.http.post(`/donor`, JSON.stringify(data), config).pipe(
      shareReplay(),
    );
  
    shared.subscribe((data: Stock) => {
      this.dataStore.stocks.push(data);
      this._stocks.next(Object.assign({}, this.dataStore).stocks);
    }, error => console.log('Could not create stock.'));
  
    return shared;
  }
}
