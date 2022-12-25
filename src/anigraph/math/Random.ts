import Chance from "chance";

export class SeededRandom {
  public chance: any;
  constructor(seed?: number) {
    seed = seed??Date.now();
    this.chance = new Chance(seed);
  }
  rand() {
    return this.chance.floating({ min: 0, max: 1 });
  }

  randInt(range:number|[number,number]){
    if(Array.isArray(range)){
      return this.chance.integer({ min: range[0], max: range[1]})
    }else{
      return this.chance.integer({ min: 0, max: range})
    }
  }

  floatArray(n: number) {
    const randomArray: number[] = [];
    for (let i = 0; i < n; i++) {
      randomArray.push(this.rand());
    }
    return randomArray;
  }
}

const Random = new SeededRandom();
export { Random };
