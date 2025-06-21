import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowTournamentPageRoutingModule } from './show-tournament-routing.module';

import { ShowTournamentPage } from './show-tournament.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowTournamentPageRoutingModule
  ],
  declarations: [ShowTournamentPage]
})
export class ShowTournamentPageModule {}
