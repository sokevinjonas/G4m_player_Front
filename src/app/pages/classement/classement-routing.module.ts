import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClassementPage } from './classement.page';

const routes: Routes = [
  {
    path: '',
    component: ClassementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassementPageRoutingModule {}
