import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomeScreenPageRoutingModule } from './welcome-screen-routing.module';

import { WelcomeScreenPage } from './welcome-screen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomeScreenPageRoutingModule
  ],
  declarations: [WelcomeScreenPage]
})
export class WelcomeScreenPageModule {}
