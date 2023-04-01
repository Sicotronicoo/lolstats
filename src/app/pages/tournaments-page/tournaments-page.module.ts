import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TournamentsPageRoutingModule } from './tournaments-page-routing.module';
import { TournamentsPageComponent } from './tournaments-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [
    TournamentsPageComponent
  ],
  imports: [
    CommonModule,
    TournamentsPageRoutingModule,
    ReactiveFormsModule
  ]
})
export class TournamentsPageModule { }
