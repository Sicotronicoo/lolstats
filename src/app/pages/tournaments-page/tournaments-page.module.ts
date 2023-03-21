import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TournamentsPageRoutingModule } from './tournaments-page-routing.module';
import { TournamentsPageComponent } from './tournaments-page.component';


@NgModule({
  declarations: [
    TournamentsPageComponent
  ],
  imports: [
    CommonModule,
    TournamentsPageRoutingModule
  ]
})
export class TournamentsPageModule { }
