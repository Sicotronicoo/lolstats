import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {canActivate, redirectLoggedInTo, redirectUnauthorizedTo} from "@angular/fire/auth-guard";

const redirectLoggedInToHome = () => redirectLoggedInTo(['']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);

const routes: Routes = [
  {
    ...canActivate(redirectUnauthorizedToLogin),
    path: 'add',
    loadChildren: () => import('./pages/add-stats-page/add-stats-page.module').then(m => m.AddStatsPageModule)
  },
  {
    ...canActivate(redirectUnauthorizedToLogin),
    path: 'profile',
    loadChildren: () => import('./pages/profile-page/profile-page.module').then(m => m.ProfilePageModule)
  },
  {
    ...canActivate(redirectUnauthorizedToLogin),
    path: 'tournaments',
    loadChildren: () => import('./pages/tournaments-page/tournaments-page.module').then(m => m.TournamentsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
