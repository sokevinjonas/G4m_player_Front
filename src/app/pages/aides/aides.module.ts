import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AidesPageRoutingModule } from './aides-routing.module';

import { AidesPage } from './aides.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AidesPageRoutingModule
  ],
  declarations: [AidesPage]
})
export class AidesPageModule {}
