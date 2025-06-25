import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PolitiquePageRoutingModule } from './politique-routing.module';

import { PolitiquePage } from './politique.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PolitiquePageRoutingModule
  ],
  declarations: [PolitiquePage]
})
export class PolitiquePageModule {}
