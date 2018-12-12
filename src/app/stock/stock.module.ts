import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { StockComponent } from './stock.component';

@NgModule({
  imports: [
    CommonModule,
    StockRoutingModule
  ],
  declarations: [StockComponent]
})
export class StockModule { }
