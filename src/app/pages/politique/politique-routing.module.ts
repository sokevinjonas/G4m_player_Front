import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PolitiquePage } from './politique.page';

const routes: Routes = [
  {
    path: '',
    component: PolitiquePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PolitiquePageRoutingModule {}
