import { EnemyStatsComponent } from './../enemy-stats/enemy-stats.component';
import { PlayerStatsComponent } from './../playerStats/player-stats/player-stats.component';
import { ENERGYORB, IItem, IItemPreview } from './../logic/gameplay.models';
import { LogicGameplayService } from './../logic/logic-gameplay.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IRoomData, ISlab } from '../logic/gameplay.models';

@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.component.html',
  styleUrls: ['./gameplay.component.scss'],
})
export class GameplayComponent implements OnInit {

  @ViewChild('playerStats') vcPlayerStats!:PlayerStatsComponent;
  @ViewChild('enemyStats') vcEnemyStats!:EnemyStatsComponent;

  slabs:ISlab[] = [];

  idxKeyPosition:number = 0;
  idxDoorPosition:number = 0;
  randomItemsPreview:IItemPreview[] = [];

  maxSlabs  = 0;
  columnSizeHud= 1;

  roomData!:IRoomData;

  //Combate por turnos
  isPlayerTurn = true;
  maxPlayerSlabsPerTurn = 3;
  actualPlayerTurn=0;
  slabsFliped:number[] =[];

  maxEnemySlabsPerTurn = 2;
  actualEnemyTurn=0;
  intervalEnemyTurn!:any;

  constructor(private _gpService:LogicGameplayService) { }

  ngOnInit() {
   this.getRoomData();
   this.initGrid();
   this.setDoorKeyRandomPos();
   this.setGridElements();
   this.setColumnSize();
  }

  getRoomData(){
    this.roomData = this._gpService.getRoomData();
    this.maxSlabs = this.roomData.slabs;
  }

  setDoorKeyRandomPos(){

    this.idxKeyPosition =  Math.floor(Math.random() * this.maxSlabs);
    this.idxDoorPosition= this.idxKeyPosition;
    while(this.idxKeyPosition == this.idxDoorPosition){
      this.idxDoorPosition = Math.floor(Math.random() * this.maxSlabs);
    }

    //Set the key and door position
    this.slabs[this.idxKeyPosition].item= {class:'key'};
    this.slabs[this.idxDoorPosition].item= {class:'door_closed'};


    //0 is always the key
    this.randomItemsPreview[0]= {
      position: this.idxKeyPosition,
      item:{
        class:'door_closed'
      }
    };
    this.randomItemsPreview[1]= {
      position: this.idxDoorPosition,
      item:{
        class:'key'
      }
    };


  }

  setGridElements(){
    let rd= this.roomData;
    this.maxSlabs = rd.slabs;


    // 1) Orbes de energía.
    let energyOrbsPositions:number[];
    for(let i=0; i< rd.energyOrbs.count; i++){
      this.setItemToSlabsInRandomPos({
        class:ENERGYORB
      });
    }
  }

  //1) Orbes de energía.
  setItemToSlabsInRandomPos(item:IItem){
    let rndmPos = Math.floor(Math.random() * this.maxSlabs);

    while(this.randomItemsPreview.find(x=> x.position == rndmPos) != undefined){
      rndmPos = Math.floor(Math.random() * this.maxSlabs)
    }

    this.randomItemsPreview[this.randomItemsPreview.length]= {
      position: rndmPos,
      item:item
    };

    this.slabs[rndmPos].item= item;
  }


  initGrid(){
    for (let i = 0; i < this.maxSlabs; i++){
      this.slabs.push({
        item:{
          class : 'empty',
        },
        revealed:false
      });
    }

  }

  flipSlab(slab:ISlab, index:number, isPlayer:boolean){

    if(isPlayer && !this.isPlayerTurn){
      return;
    }

    if(!slab.revealed){
      slab.revealed= true;
      if(index== this.idxDoorPosition){
        console.log('Puerta Encontrada');
      }else if(index== this.idxKeyPosition){
        console.log('Key Encontrada');
      }else if(slab.item.class==ENERGYORB){
        this.vcPlayerStats.updateStat({stat:ENERGYORB, value: +1});
      }
      this.slabsFliped.push(index);

      if(isPlayer)
       this.slabFlipedPlayer(index);

      if(!isPlayer)
        this.slabFlipedEnemy(index);
    }
  }

  slabFlipedPlayer(idx:number) {

    this.actualPlayerTurn+=1;
    if(this.actualPlayerTurn>= this.maxPlayerSlabsPerTurn){
      //El jugador golpea ataque básico
      this.playerBasicAttack();

      //Se activa el turno del enemigo
      this.startEnemyturn();
      this.actualPlayerTurn=0;
    }
  }

  slabFlipedEnemy(idx:number) {

    this.actualEnemyTurn+=1;
    if(this.actualEnemyTurn>= this.maxEnemySlabsPerTurn){
     this.endEnemyTurn();
    }
  }

  startEnemyturn(){
    console.warn("Start Enemy turn");

    this.isPlayerTurn=false;
    if(!this.intervalEnemyTurn){
      this.intervalEnemyTurn= setInterval(()=>{this.resolveEnemyTurn();}, 1600);
    }
  }
  endEnemyTurn(){
    console.warn('End enemyTurn');
    clearInterval(this.intervalEnemyTurn);
    this.intervalEnemyTurn=null;
    //El Enemigo golpea ataque básico

    //Se activa el turno del player
    this.isPlayerTurn=true;
    this.actualEnemyTurn=0;
  }

  resolveEnemyTurn(){
      if(this.slabsFliped.length!=this.slabs.length){
        let rndmPos = Math.floor(Math.random() * this.maxSlabs);
        while(this.slabsFliped.find(x=> x == rndmPos) != undefined){
          rndmPos = Math.floor(Math.random() * this.maxSlabs);
        }
        let slab= this.slabs[rndmPos];
        this.flipSlab(slab, rndmPos, false);
      }else{
        //Ya se destaparon todas
        this.endEnemyTurn();
      }


  }

  playerBasicAttack(){
    let playerPower =  0;
    let enemyEvade = this.vcEnemyStats.resolveEvasion();
    let finalDmg=0;

    if(!enemyEvade){
      playerPower =  this.vcPlayerStats.resolveAttackBasicDmg();
      let enemyShieldR = this.vcEnemyStats.stats.shield;

      if(enemyShieldR>0){
        this.vcEnemyStats.updateStat({stat:'shield', value:(-playerPower)})
        enemyShieldR -= playerPower;
      }else{
        finalDmg=playerPower;
      }

      if(enemyShieldR<0){
        finalDmg = enemyShieldR
      }
    }else{
      console.warn('enemyEvadeBasicAttack');
    }

    this.vcEnemyStats.updateStat({stat:'health', value:(-finalDmg)})

    console.log({playerPower, dmg: finalDmg});
  }

  setColumnSize(){
    switch(this.maxSlabs){
      case 24:
        this.columnSizeHud = 3;
      break;

      case 36:
        this.columnSizeHud = 3;
      break;

      case 48:
        this.columnSizeHud = 2;
      break;

      case 54:
        this.columnSizeHud =  2;
          break;
    }
  }

}


