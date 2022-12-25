import { v4 as uuidv4 } from "uuid";

export abstract class ACallbackSwitch {
  // public callback:(...args:any[])=>any;
  public handle: string;
  public active: boolean;
  abstract activate(): void;
  abstract deactivate(): void;

  constructor(handle?: string) {
    if (handle === undefined) {
      handle = uuidv4() as string;
    }
    this.handle = handle;
    this.active = false;
  }
}
