import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'tournaments',
        loadChildren: () =>
          import('../tournaments/tournaments.module').then(
            (m) => m.TournamentsPageModule
          ),
      },
      {
        path: 'games',
        loadChildren: () =>
          import('../games/games.module').then((m) => m.GamesPageModule),
      },
      {
        path: 'classement',
        loadChildren: () =>
          import('../classement/classement.module').then(
            (m) => m.ClassementPageModule
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../profile/profile.module').then((m) => m.ProfilePageModule),
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
