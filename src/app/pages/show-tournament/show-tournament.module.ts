import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowTournamentPageRoutingModule } from './show-tournament-routing.module';

import { ShowTournamentPage } from './show-tournament.page';
import { JsonParsePipe } from '../../pipes/json-parse.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowTournamentPageRoutingModule,
    JsonParsePipe,
  ],
  declarations: [ShowTournamentPage],
})
export class ShowTournamentPageModule {}
