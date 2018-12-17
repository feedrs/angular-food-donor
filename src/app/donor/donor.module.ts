import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { DonorComponent } from './donor.component';
import { DonorRoutingModule } from './donor-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    DonorRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [DonorComponent]
})
export class DonorModule { }
