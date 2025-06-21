import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowGamesPageRoutingModule } from './show-games-routing.module';

import { ShowGamesPage } from './show-games.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowGamesPageRoutingModule
  ],
  declarations: [ShowGamesPage]
})
export class ShowGamesPageModule {}
