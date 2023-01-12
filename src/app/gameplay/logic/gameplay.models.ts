
export interface ISlab{
  item:IItem;
  revealed:boolean;
}

export interface IItem{
  class:String;
  effect?:IEffect;
}

export interface IItemPreview{
  position:number;
  item:IItem;
}

export interface IEffect{
  id:number;
  value:number;
  valueStr:string;
}

export interface IRoomData{
  id:number;
  slabs:number;
  energyOrbs:basicEffectData;
  enemies?:IEnemy[],
  teasures?:ITeasure[],
  freeBasics:number;
  forceOrbs:basicEffectData;
  healOrbs:basicEffectData;
}

export interface basicEffectData{
  count:number;
  minVal:number;
  maxVal:number;
}

export interface IEnemy{
  name:string;
  health:number;
  damage:number;
}

export interface ITeasure{
  id:number;
}



///////////// COMBATE ////////////

export interface ICharacterStats{
  maxHealth:number;
  actualHealth:number;
  power:number;
  shield:number;
  actualEnergy:number;
  criticChance:number;
  evasionChance:number;
  lifeSteal:number;
};


export interface IModifyStat{
  stat:string;
  value:number;
};






///CLASSSESSS
export const ENERGYORB='energy_orb';
