import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { QuoteService } from './quote.service';

export const datas = [
  {
    percentage: '6',
    id: '43',
    title: 'New Tickets'
  },
  {
    percentage: '6',
    id: '43',
    title: 'New Tickets'
  },
  {
    percentage: '6',
    id: '43',
    title: 'New Tickets'
  },
  {
    percentage: '6',
    id: '43',
    title: 'New Tickets'
  },
  {
    percentage: '6',
    id: '43',
    title: 'New Tickets'
  },
  {
    percentage: '6',
    id: '43',
    title: 'New Tickets'
  }
]

export const purchases = [0, 5, 1, 2, 7, 5, 6, 8, 24, 7, 12]

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  datas = datas;
  quote: string;
  isLoading: boolean;
  data = purchases;
  label = 'Purchases';
  public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'December'];

  // lineChart
  public datasets: any[] = []

  public get labels() {
    return this.lineChartLabels;
  }

  public options: any = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          display: true,
          gridLines: {
            display: false
          }
        },
      ],
      yAxes: [
        {
          display: true,
          gridLines: {
            display: false
          }
        },
      ],
    },
    legend: {
      display: false,
    },
    elements: {
      line: {
        borderWidth: 2,
        tension: 0,
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    animation: {
      duration: 0, // general animation time
    },
    responsive: true,
  }

  public colors: Array<any> = [
    {
      backgroundColor: 'rgba(70,127,207,0.1)',
      borderColor: 'rgba(70,127,207)',
    },
  ]

  constructor(private quoteService: QuoteService) { }

  ngOnInit() {
    // this.isLoading = true;
    // this.quoteService.getRandomQuote({ category: 'dev' })
    //   .pipe(finalize(() => { this.isLoading = false; }))
    //   .subscribe((quote: string) => { this.quote = quote; });

    this.datasets = [
      {
        data: this.data,
        label: this.label,
      },
    ];
  }

}
