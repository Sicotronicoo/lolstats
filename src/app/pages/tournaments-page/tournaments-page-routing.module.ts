import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TournamentsPageComponent } from './tournaments-page.component';

const routes: Routes = [{ path: '', component: TournamentsPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TournamentsPageRoutingModule { }
