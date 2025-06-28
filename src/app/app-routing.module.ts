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
  {
    path: 'welcome-screen',
    loadChildren: () =>
      import('./welcome-screen/welcome-screen.module').then(
        (m) => m.WelcomeScreenPageModule
      ),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'aides',
    loadChildren: () =>
      import('./pages/aides/aides.module').then((m) => m.AidesPageModule),
  },
  {
    path: 'guide',
    loadChildren: () =>
      import('./pages/guide/guide.module').then((m) => m.GuidePageModule),
  },
  {
    path: 'politique',
    loadChildren: () =>
      import('./pages/politique/politique.module').then(
        (m) => m.PolitiquePageModule
      ),
  },
  {
    path: 'classement',
    loadChildren: () =>
      import('./pages/classement/classement.module').then(
        (m) => m.ClassementPageModule
      ),
  },
  {
    path: 'historique',
    loadChildren: () =>
      import('./pages/historique/historique.module').then(
        (m) => m.HistoriquePageModule
      ),
  },
  {
    path: 'parrainage',
    loadChildren: () =>
      import('./pages/parrainage/parrainage.module').then(
        (m) => m.ParrainagePageModule
      ),
  },
  {
    path: 'modifier-mon-profil',
    loadChildren: () =>
      import('./pages/modifier-mon-profil/modifier-mon-profil.module').then(
        (m) => m.ModifierMonProfilPageModule
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
