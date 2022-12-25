export class PromiseListener<T> {
  _promise: Promise<T>;
  _pending: boolean = true;
  _rejected: boolean = false;
  _fulfilled: boolean = false;
  _result: Promise<any>;
  constructor(promise: Promise<T>) {
    this._promise = promise;
    const self = this;
    this._result = promise.then(
      function (v: T) {
        self._fulfilled = true;
        self._pending = false;
        return v;
      },
      function (e) {
        self._rejected = true;
        self._pending = false;
        throw e;
      }
    );
  }
}
