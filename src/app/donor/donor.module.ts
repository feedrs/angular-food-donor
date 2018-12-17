import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { DonorComponent } from './donor.component';
import { DonorRoutingModule } from './donor-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    DonorRoutingModule,
    ReactiveFormsModule,
    NgbModule.forRoot()
  ],
  declarations: [DonorComponent]
})
export class DonorModule { }
