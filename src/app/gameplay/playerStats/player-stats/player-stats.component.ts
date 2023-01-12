import { LogicGameplayService } from './../../logic/logic-gameplay.service';
import { Component, Input, OnInit } from '@angular/core';
import { ENERGYORB, ICharacterStats, IModifyStat } from '../../logic/gameplay.models';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.scss'],
})
export class PlayerStatsComponent implements OnInit {

  // @Input() modifyStat!:IModifyStat;

  playerSkills:IPlayerSkill[] = [];
  stats!:ICharacterStats;

  constructor(private gpService:LogicGameplayService) { }

  ngOnInit() {
   this.getPlayerSkills();
   this.setPlayerStats();
  }

  getPlayerSkills(){
    this.playerSkills[0] = {
      id: 1,
      energyCost:3
    };
    this.playerSkills[1] = {
      id: 2,
      energyCost:2
    };
    this.playerSkills[2] = {
      id: 3,
      energyCost:4
    };
    this.playerSkills[3] = {
      id: 4,
      energyCost:6
    };
  }

  setPlayerStats(){
    this.stats= this.gpService.getPlayerStats();
  }

  public resolveAttackBasicDmg():number{
    let dmg = this.stats.power;
    let critic =  Math.floor(Math.random() * 100);

    if(critic<=this.stats.criticChance){
      console.warn('Critical!');
      dmg*=2;
    }
    return dmg;
  }


  public updateStat(data:IModifyStat){
      switch(data.stat){
        case 'health':
            this.stats.actualHealth += data.value;
            if(this.stats.actualHealth > this.stats.maxHealth){
              this.stats.actualHealth = this.stats.maxHealth;
            }
          break;
        case 'power':
          this.stats.power += data.value;
          break;
        case 'shield':
          this.stats.shield += data.value;
          break;
        case ENERGYORB:
          this.stats.actualEnergy += data.value;
          break;
        case 'critical':
          this.stats.criticChance += data.value;
          break;
        case 'evasion':
          this.stats.evasionChance += data.value;
          break;
      }
  }

  public resolveEvasion():boolean {

    if(this.stats.evasionChance == 0)
      return false;

    let ev = this.stats.evasionChance;
    let evade =  Math.floor(Math.random() * 100);

    return(evade<=ev);

  }
}

export interface IPlayerSkill{
  id:number;
  energyCost:number;
}
