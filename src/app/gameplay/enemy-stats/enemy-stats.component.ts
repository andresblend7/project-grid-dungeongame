import { LogicGameplayService } from './../logic/logic-gameplay.service';
import { Component, OnInit } from '@angular/core';
import { ENERGYORB, ICharacterStats, IModifyStat } from '../logic/gameplay.models';

@Component({
  selector: 'app-enemy-stats',
  templateUrl: './enemy-stats.component.html',
  styleUrls: ['./enemy-stats.component.scss'],
})
export class EnemyStatsComponent implements OnInit {

  idEnemy:number=0;
  stats!:ICharacterStats;


  constructor(private gpService:LogicGameplayService) { }

  ngOnInit() {
    this.initStats();
  }

  initStats(){
    this.stats = this.gpService.getEnemyStats(this.idEnemy);
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
