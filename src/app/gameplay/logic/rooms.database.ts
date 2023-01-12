import { IRoomData } from './gameplay.models';

export const ROOM1_DATA= function():IRoomData{
  return {
    id:1,
    slabs:48,
    energyOrbs:{
      count:6,
      minVal:1,
      maxVal:2
    },
    freeBasics:3,
    forceOrbs:{
      count:3,
      minVal:1,
      maxVal:1
    },
    healOrbs:{
      count:3,
      minVal:1,
      maxVal:2
    }
  };
}
