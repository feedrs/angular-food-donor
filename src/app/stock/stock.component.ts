import { Component, OnInit } from '@angular/core';
import { DonorService } from '@app/donor/donor.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {

  nostocks$: Observable<any>;
  lowstocks$: Observable<any>;
  wellstocks$: Observable<any>;

  constructor(private donorService: DonorService) { }

  ngOnInit() {
    this.donorService.loadAllStock();
    this.nostocks$ = this.donorService.nostocks;
    this.lowstocks$ = this.donorService.lowstocks;
    this.wellstocks$ = this.donorService.wellstocks;
  }

}
