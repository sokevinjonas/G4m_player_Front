import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowGamesPage } from './show-games.page';

const routes: Routes = [
  {
    path: '',
    component: ShowGamesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowGamesPageRoutingModule {}
