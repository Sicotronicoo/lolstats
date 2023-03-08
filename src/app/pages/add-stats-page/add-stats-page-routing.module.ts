import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStatsPageComponent } from './add-stats-page.component';

const routes: Routes = [{ path: '', component: AddStatsPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddStatsPageRoutingModule { }
