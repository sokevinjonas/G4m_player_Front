import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'show-tournament/:id',
    loadChildren: () =>
      import('./pages/show-tournament/show-tournament.module').then(
        (m) => m.ShowTournamentPageModule
      ),
  },
  {
    path: 'show-games/:id',
    loadChildren: () =>
      import('./pages/show-games/show-games.module').then(
        (m) => m.ShowGamesPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
