import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactUsRoutingModule } from './contact-us-routing.module';
import { ContactUsComponent } from './contact-us.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ContactUsRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ContactUsComponent]
})
export class ContactUsModule { }
