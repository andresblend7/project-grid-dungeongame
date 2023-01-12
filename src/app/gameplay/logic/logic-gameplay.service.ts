import { ICharacterStats, IRoomData } from './gameplay.models';
import { Injectable } from '@angular/core';
import { ROOM1_DATA } from './rooms.database';

@Injectable({
  providedIn: 'root'
})
export class LogicGameplayService {

  hidenLevel= 0;
  roomLevel= 0;

  constructor() { }

  getRoomData():IRoomData{
    return ROOM1_DATA();
  }

  getPlayerStats():ICharacterStats{
    return {
      maxHealth: 30,
      actualHealth: 30,
      power:4,
      shield: 4,
      actualEnergy: 0,
      criticChance: 5,
      evasionChance: 10,
      lifeSteal:0
    };
  }

  getEnemyStats(idEnemy:number):ICharacterStats{
    return {
      maxHealth: 16,
      actualHealth: 16,
      power:3,
      shield: 0,
      actualEnergy: 0,
      criticChance: 0,
      evasionChance: 2,
      lifeSteal:0
    };
  }


}
