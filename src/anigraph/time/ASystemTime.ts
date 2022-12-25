import { AObject, AObjectState, ASerializable } from "../base";

@ASerializable("_ASystemTime")
export class _ASystemTime extends AObject {
  @AObjectState paused!: boolean;
  @AObjectState time!: number;
  protected timer!: NodeJS.Timer;

  constructor() {
    super();
    this.paused = true;
    this.time = Date.now();
    this.unpause();
  }
  pause() {
    if (!this.paused) {
      this.paused = true;
      clearInterval(this.timer);
    }
  }
  unpause() {
    if (this.paused) {
      const self = this;
      this.paused = false;
      this.timer = setInterval(() => {
        if (!self.paused) {
          self.time = Date.now();
        }
      });
    }
  }
  togglePause() {
    if (this.paused) {
      this.unpause();
    } else {
      this.pause();
    }
  }

  addListener(callback: (t: number) => any) {
    const self = this;
    return this.addStateKeyListener("time", () => {
      callback(self.time);
    });
  }
}
