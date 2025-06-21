import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowTournamentPage } from './show-tournament.page';

const routes: Routes = [
  {
    path: '',
    component: ShowTournamentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowTournamentPageRoutingModule {}
