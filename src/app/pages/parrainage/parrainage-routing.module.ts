import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParrainagePage } from './parrainage.page';

const routes: Routes = [
  {
    path: '',
    component: ParrainagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParrainagePageRoutingModule {}
