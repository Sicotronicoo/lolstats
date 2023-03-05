import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddStatsPageRoutingModule } from './add-stats-page-routing.module';
import { AddStatsPageComponent } from './add-stats-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [
    AddStatsPageComponent
  ],
  imports: [
    CommonModule,
    AddStatsPageRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class AddStatsPageModule { }
