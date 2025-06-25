import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifierMonProfilPageRoutingModule } from './modifier-mon-profil-routing.module';

import { ModifierMonProfilPage } from './modifier-mon-profil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModifierMonProfilPageRoutingModule
  ],
  declarations: [ModifierMonProfilPage]
})
export class ModifierMonProfilPageModule {}
