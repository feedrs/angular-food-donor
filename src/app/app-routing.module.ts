import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    { path: 'stocks', loadChildren: 'app/stock/stock.module#StockModule' },
    { path: 'donor', loadChildren: 'app/donor/donor.module#DonorModule' },
    { path: 'about', loadChildren: 'app/about/about.module#AboutModule' },
    { path: 'contact-us', loadChildren: 'app/contact-us/contact-us.module#ContactUsModule' },
  ]),
  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
