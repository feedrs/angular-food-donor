import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { map, catchError } from 'rxjs/operators';
import { of, BehaviorSubject } from 'rxjs';
import { Stock } from '@app/model/stock';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  stocks: Observable<Stock[]>;
  private _stocks: BehaviorSubject<Stock[]>;
  private dataStore: {
    stocks: Stock[]
  };

  constructor(public http: HttpClient) { 

    this.dataStore = { stocks: [] };
    this._stocks = <BehaviorSubject<Stock[]>>new BehaviorSubject([]);
    this.stocks = this._stocks.asObservable();
  }

  loadAll() {
    this.http.get<Stock[]>("/stock")
      .subscribe(data => {
        console.log(data);
        this.dataStore.stocks = data;
        this._stocks.next(Object.assign({}, this.dataStore).stocks);
      }, error => console.log('Error, could not load cart'));
  }

  update(data: any) { 


    // this.http.put(`/todos/${cartItem.id}`, JSON.stringify(cartItem))
    //   .subscribe((data: CartDetail) => {
    this.dataStore.stocks.forEach((t: any, i: any) => {
      if (t.id === data.id) { this.dataStore.stocks[i] = data; }
    });
    // this._userItems.next(Object.assign({}, this.dataStore).userItems);
    // }, error => console.log('Could not update cart items.'));
  }

  // getCustomer(): Observable<Customer> {
  //   return this.http
  //     .get("/customer")
  //     .pipe(
  //       map(data => data.json()),
  //       catchError(() => of('Error, could not load customer'))
  //     );
  // }
}
