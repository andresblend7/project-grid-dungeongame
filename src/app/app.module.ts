import { PlayerStatsComponent } from './gameplay/playerStats/player-stats/player-stats.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameplayComponent } from './gameplay/gameplay/gameplay.component';
import { EnemyStatsComponent } from './gameplay/enemy-stats/enemy-stats.component';

@NgModule({
  declarations: [AppComponent, GameplayComponent, PlayerStatsComponent, EnemyStatsComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
