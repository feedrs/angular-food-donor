import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { DonorComponent } from './donor.component';
import { DonorRoutingModule } from './donor-routing.module';

@NgModule({
  imports: [
    CommonModule,
    DonorRoutingModule
  ],
  declarations: [DonorComponent]
})
export class DonorModule { }
