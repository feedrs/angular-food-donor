import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DonorService } from './donor.service';

@Component({
  selector: 'app-donor',
  templateUrl: './donor.component.html',
  styleUrls: ['./donor.component.scss']
})
export class DonorComponent implements OnInit {

  submitted: boolean = false;
  donorForm: any;

  constructor(private _formBuilder: FormBuilder, private donorService: DonorService) { }

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
  }

  get f() { return this.donorForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.donorForm.invalid) {
      return;
    }

    // console.log(this.donorForm.value);
    this.donorService.create(this.donorForm.value)
  }

}
