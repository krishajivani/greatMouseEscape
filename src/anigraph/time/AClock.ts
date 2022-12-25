import { AObject, AObjectState, ASerializable, CallbackType } from "../base";
import { BezierTween } from "../math";
// import {v4 as uuidv4} from "uuid";
// import {ADragInteraction} from "../ainteraction";
import { _ASystemTime } from "./ASystemTime";

export enum AClockEnums {
  DEFAULT_PERIOD_IN_MILLISECONDS = 1000,
  TIME_UPDATE_SUBSCRIPTION_HANDLE = "TimeUpdate",
}

/***
 * time passed is tiem-refStart
 * Pausing
 */
export class AClock extends AObject {
  static SystemTime: _ASystemTime = new _ASystemTime();

  @AObjectState time!: number;

  //Whether the clock is paused
  protected _paused: boolean = true;

  // The time value of the clock is the difference between the current time and refStart.
  // When the clock is unpaused, refStart remains constant as time progresses, increasing the value of the clock.
  // When the clock is unpaused after pausing, the time it spent paused will be added to refStart.
  protected _refStart: number = 0;

  // The time when the clock was last paused or unpaused
  protected _lastPauseStateChange: number = 0;

  // The time of the last update
  protected _lastUpdate: number = 0;

  // The current clock's value at the last update
  protected _lastClockTimeUpdated: number = 0;

  // Offset is used to "commit" the passage of time to the clock's memory.
  // This becomes important if we change the clock's rate, as previous milliseconds may passed at different rates, contributing different amounts to the clock's current value.
  protected _offset: number = 0;

  // This defines the current rate of the clock in terms of a period.
  // It can be changed over time to make the clock progress slower or faster.
  protected _periodInMilliseconds: number =
    AClockEnums.DEFAULT_PERIOD_IN_MILLISECONDS;

  /** Get set paused */
  set paused(value: boolean) {
    this._paused = value;
  }
  get paused() {
    return this._paused;
  }

  get lastTimeUpdated() {
    return this._lastClockTimeUpdated;
  }

  get rate() {
    return (
      AClockEnums.DEFAULT_PERIOD_IN_MILLISECONDS / this._periodInMilliseconds
    );
  }
  set rate(v: number) {
    let now = this._getNow();
    this._offset = this.time;
    this._refStart = now;
    this._periodInMilliseconds = AClockEnums.DEFAULT_PERIOD_IN_MILLISECONDS / v;
  }

  addTimeListener(callback: (t: number) => any, handle?: string) {
    const self = this;
    return this.addStateKeyListener(
      "time",
      () => {
        callback(self.time);
      },
      handle,
      false
    );
  }

  constructor() {
    super();
    this.reset(0);
    this.initClockSubscription();
  }

  initClockSubscription() {
    const self = this;
    this.subscribe(
      AClock.SystemTime.addListener((t) => {
        self.update(t);
      }),
      AClockEnums.TIME_UPDATE_SUBSCRIPTION_HANDLE
    );
  }

  reset(t0: number = 0) {
    this.time = t0;
    this._refStart = t0;
    this._lastPauseStateChange = t0;
    this._lastUpdate = t0;
    this._offset = 0;
    this._periodInMilliseconds = AClockEnums.DEFAULT_PERIOD_IN_MILLISECONDS;
    this._paused = true;
  }

  update(t: number) {
    if (this._paused) {
      return;
    }
    this.time =
      this._offset + (t - this._refStart) / this._periodInMilliseconds;
    this._lastUpdate = t;
    this._lastClockTimeUpdated = this.time;
  }

  _getNow() {
    return Date.now();
  }

  play() {
    if (!this.paused) {
      return;
    }
    let now = this._getNow();
    this._refStart = this._refStart + (now - this._lastPauseStateChange);
    this._paused = false;
    this._lastPauseStateChange = now;
    this.activateSubscription(AClockEnums.TIME_UPDATE_SUBSCRIPTION_HANDLE);
  }

  pause() {
    let now = this._getNow();
    this._paused = true;
    this._lastPauseStateChange = now;
    this.deactivateSubscription(AClockEnums.TIME_UPDATE_SUBSCRIPTION_HANDLE);
  }

  /**
   * IMPORTANT! If you want to remove the listener at the end of the action
   * you need to do so in the actionOverCallback!
   * @param callback
   * @param duration
   * @param actionOverCallback
   * @param tween
   * @returns {AStateCallbackSwitch}
   * @constructor
   */
  CreateTimedAction(
    callback: (actionProgress: number) => any,
    duration: number,
    actionOverCallback: CallbackType,
    tween?: BezierTween
  ) {
    const self = this;
    const startTime = this.time;
    return this.addTimeListener((t: number) => {
      //calculate how much time has passed
      let timePassed = t - startTime;
      // Check to see if the duration has passed
      if (timePassed > duration) {
        if (actionOverCallback) {
          actionOverCallback();
        }
        return;
      }
      let normalizedTime: number = timePassed / duration;
      if (tween) {
        normalizedTime = tween.eval(normalizedTime);
      }
      callback(normalizedTime);
    });
  }
}


AClock.SystemTime.unpause();
