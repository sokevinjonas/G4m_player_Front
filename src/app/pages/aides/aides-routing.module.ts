import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AidesPage } from './aides.page';

const routes: Routes = [
  {
    path: '',
    component: AidesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AidesPageRoutingModule {}
