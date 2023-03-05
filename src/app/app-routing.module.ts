import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {canActivate, redirectLoggedInTo, redirectUnauthorizedTo} from "@angular/fire/auth-guard";

const redirectLoggedInToHome = () => redirectLoggedInTo(['']);
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);

const routes: Routes = [
  {
    ...canActivate(redirectUnauthorizedToLogin),
    path: 'games',
    loadChildren: () => import('./pages/last-games-page/last-games-page.module').then(m => m.LastGamesPageModule)
  },
  {
    ...canActivate(redirectUnauthorizedToLogin),
    path: 'add',
    loadChildren: () => import('./pages/add-stats-page/add-stats-page.module').then(m => m.AddStatsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
