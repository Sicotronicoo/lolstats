import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LastGamesPageComponent } from './last-games-page.component';

const routes: Routes = [{ path: '', component: LastGamesPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LastGamesPageRoutingModule { }
