import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DonorService } from './donor.service';
import { FoodService } from './food.service';

@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html',
  styleUrls: ['./donor.component.scss']
})
export class DonorComponent implements OnInit {

  types: any[] = [
    {
      id: 'dry', desc: 'Dry'
    },
    {
      id: 'wet', desc: 'Wet'
    },
  ]
  success: boolean = false;

  donorForm: any;
  foods: any;
  stocks: any;

  constructor(private _formBuilder: FormBuilder, private donorService: DonorService, private foodService: FoodService) { }

  ngOnInit() {

    this.donorForm = this._formBuilder.group({
      first_name: ["", Validators.required],
      last_name: ["", Validators.required],
      email: ["", Validators.required],
      address: ["", Validators.required],
      food_type: ["", Validators.required],
      food_name: ["", Validators.required],
      quantity: ["", Validators.required],
    });

    this.foods = this.foodService.foods;
  }

  getFood(data: any) {
    console.log(data);
    this.foodService.getByType(data);
  }

  get f() { return this.donorForm.controls; }

  onSubmit() {
    if (this.donorForm.invalid) {
      return;
    }

    if (this.donorForm.valid) {
      this.donorService.create(this.donorForm.value).subscribe(() => {
        this.success = true;
        this.donorForm.reset();
      });
    }
  }

}
