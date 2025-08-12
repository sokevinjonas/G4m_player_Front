import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModifierMonProfilPageRoutingModule } from './modifier-mon-profil-routing.module';

import { ModifierMonProfilPage } from './modifier-mon-profil.page';
import { AvatarSelectionModalComponent } from 'src/app/components/avatar-selection-modal/avatar-selection-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModifierMonProfilPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ModifierMonProfilPage, AvatarSelectionModalComponent],
})
export class ModifierMonProfilPageModule {}
