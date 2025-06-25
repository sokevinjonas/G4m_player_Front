import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModifierMonProfilPage } from './modifier-mon-profil.page';

const routes: Routes = [
  {
    path: '',
    component: ModifierMonProfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModifierMonProfilPageRoutingModule {}
