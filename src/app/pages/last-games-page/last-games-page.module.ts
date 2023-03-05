import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LastGamesPageRoutingModule } from './last-games-page-routing.module';
import { LastGamesPageComponent } from './last-games-page.component';


@NgModule({
  declarations: [
    LastGamesPageComponent,
  ],
  imports: [
    CommonModule,
    LastGamesPageRoutingModule
  ]
})
export class LastGamesPageModule { }
