import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { map, catchError } from 'rxjs/operators';
import { of, BehaviorSubject } from 'rxjs';
import { Donor } from '@app/model/donor';

@Injectable({
  providedIn: 'root'
})
export class DonorService {

  donors: Observable<Donor[]>;
  private _donors: BehaviorSubject<Donor[]>;
  private dataStore: {
    donors: Donor[]
  };

  constructor(public http: HttpClient) { 

    this.dataStore = { donors: [] };
    this._donors = <BehaviorSubject<Donor[]>>new BehaviorSubject([]);
    this.donors = this._donors.asObservable();
  }

  loadAll() {
    this.http.get<Donor[]>("/donor")
      .subscribe(data => {
        console.log(data);
        this.dataStore.donors = data;
        this._donors.next(Object.assign({}, this.dataStore).donors);
      }, error => console.log('Error, could not load donor'));
  }

  update(data: any) { 


    // this.http.put(`/todos/${cartItem.id}`, JSON.stringify(cartItem))
    //   .subscribe((data: CartDetail) => {
    this.dataStore.donors.forEach((t: any, i: any) => {
      if (t.id === data.id) { this.dataStore.donors[i] = data; }
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
