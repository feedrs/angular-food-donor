import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { of, BehaviorSubject } from 'rxjs';
import { Food } from '@app/model/food';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  foods: Observable<Food[]>;
  private _foods: BehaviorSubject<Food[]>;
  private dataStore: {
    foods: Food[]
  };

  constructor(public http: HttpClient) {

    this.dataStore = { foods: [] };
    this._foods = <BehaviorSubject<Food[]>>new BehaviorSubject([]);
    this.foods = this._foods.asObservable();
  }

  getByType(type: any) {
    console.log(type);
    this.http.get<Food[]>(`/food/${type}`)
      .subscribe(data => {
        console.log(data);
        this.dataStore.foods = data;
        this._foods.next(Object.assign({}, this.dataStore).foods);
      }, error => console.log('Error, could not load food'));
  }
}
