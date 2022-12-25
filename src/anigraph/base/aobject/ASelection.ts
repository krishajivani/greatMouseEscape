/**
 * # ASelection
 * Template class for selections of things. Allows for functions that are called upon 2d and deselection.
 */
// import objectHash from "object-hash";
import { ASerializable } from "../aserial";

export enum SelectionEvents {
  SelectionChanged = "SelectionChanged",
  SelectionItemEnter = "SelectionItemEnter",
  SelectionItemUpdate = "SelectionItemUpdate",
  SelectionItemExit = "SelectionItemExit",
}

@ASerializable("ASelection")
export class ASelection<T> {
  protected _selectionMap: { [key: string]: T };

  public _enterCallback!: (enteringSelection: T, selection?: this) => void;
  public _updateCallback!: (remainingInSelection: T, selection?: this) => void;
  public _exitCallback!: (leavingSelection: T, selection?: this) => void;

  // protected abstract _selectionMap:{[key:string]:T};

  items() {
    return Object.values(this._selectionMap);
  }

  get nSelected() {
    return Object.keys(this._selectionMap).length;
  }

  /**
   * This function takes an object of type T and returns the key used for storing that object in this._selectionMap.
   * The key should be unique to a given object, so things like hashes on uids.
   * By default, it uses a hash, but this can be overwritten for specific 2d types.
   * @param item
   * @returns {any}
   * @private
   */
  static _calcKey(item: any) {
    if (typeof item == "object" && "uid" in item) {
      return item.uid;
    } else {
      // return objectHash(item);
      throw new Error(`Not sure how to hash ${item} in ASelection!`);
    }
  }

  /**
   * The constructor optionally takes a list of items to select.
   * @param items
   */
  constructor(
    items?: T[],
    enterCallback?: (enteringSelection: T, selection?: ASelection<T>) => void,
    updateCallback?: (
      remainingInSelection: T,
      selection?: ASelection<T>
    ) => void,
    exitCallback?: (leavingSelection: T, selection?: ASelection<T>) => void
  ) {
    this._selectionMap = {};
    if (items !== undefined) {
      this.set(items);
    }
    this._enterCallback = enterCallback
      ? enterCallback
      : (a: T) => {
          return;
        };
    this._updateCallback = updateCallback
      ? updateCallback
      : (a: T) => {
          return;
        };
    this._exitCallback = exitCallback
      ? exitCallback
      : (a: T) => {
          return;
        };
  }

  mapOverElements(func: (a: T) => any) {
    let rval = [];
    let items = this.items();
    for (let i of items) {
      rval.push(func(i));
    }
    return rval;
  }

  /**
   * like mapOverElements, but doesn't add an entry for an element if func(a) doesn't return anything.
   * @param func
   * @returns {any[]}
   */
  getFilteredList(func: (a: T) => any) {
    let rval = [];
    let items = this.items();
    for (let i of items) {
      let ival = func(i);
      if (ival !== undefined) {
        rval.push(ival);
      }
    }
    return rval;
  }

  /**
   * Returns the 2d in simple list form.
   * @returns {T[]}
   */
  list() {
    const rval = new Array<T>();
    for (let key in this._selectionMap) {
      rval.push(this._selectionMap[key]);
    }
    return rval;
  }

  /**
   * Keys for selected objects
   * @returns {string[]}
   */
  keys() {
    return Object.keys(this._selectionMap);
  }

  /**
   * deselect an item
   * @param item
   */
  deselect(item: T, triggerCallbacks = true) {
    this._deselectKey(this._getKeyForItem(item));
    if (triggerCallbacks) {
      this._exitCallback(item, this);
    }
  }

  /**
   * deselect the item with a specified key
   * @param key
   * @private
   */
  _deselectKey(key: string) {
    delete this._selectionMap[key];
  }

  /**
   * deselect everything
   */
  _deselectAll() {
    if (this.nSelected === 0) {
      return;
    }
    this._selectionMap = {};
    // for(let key in this._selectionMap){
    //     this._deselectKey(key);
    // }
  }

  select(item: T, triggerCallback: boolean = true) {
    this._selectKey(this._getKeyForItem(item), item);
    if (triggerCallback) {
      this._enterCallback(item, this);
    }
  }

  _selectKey(key: string, item: T) {
    this._selectionMap[key] = item;
  }

  toggleSelected(item: T, triggerCallbacks = true) {
    let key = this._getKeyForItem(item);
    if (this._selectionMap[key]) {
      this._deselectKey(key);
      if (triggerCallbacks) {
        this._exitCallback(item, this);
      }
    } else {
      this._selectionMap[key] = item;
      if (triggerCallbacks) {
        this._enterCallback(item, this);
      }
    }
  }

  //
  // /**
  //  * Select item
  //  * @param item
  //  */
  // select(item:T){
  //     this._selectionMap[this._getKeyForItem(item)]=item;
  // }

  /**
   * Get key for a specified item
   * @param item
   * @returns {any}
   * @private
   */
  _getKeyForItem(item: T) {
    return (this.constructor as typeof ASelection)._calcKey(item);
  }

  /**
   * Set the 2d
   * @param items - What the 2d should be after the operation is complete
   * @param exitCallback - a function to run on items that leave the 2d
   * @param enterCallback - a function to run on items that enter the 2d
   * @param updateCallback - a function to run on items that stay in the 2d
   */
  public set(
    items?: T[],
    triggerCallbacks = true,
    exitCallback?: (item: T, selection?: this) => void,
    enterCallback?: (item: T, selection?: this) => void,
    updateCallback?: (item: T, selection?: this) => void
  ) {
    exitCallback = exitCallback ? exitCallback : this._exitCallback;
    enterCallback = enterCallback ? enterCallback : this._enterCallback;
    updateCallback = updateCallback ? updateCallback : this._updateCallback;

    if (items === undefined || items.length === 0) {
      if (exitCallback !== undefined) {
        const exiting = Object.values(this._selectionMap);
        this._deselectAll();
        for (let leaving of exiting) {
          exitCallback(leaving, this);
        }
      } else {
        this._deselectAll();
      }
      return;
    } else {
      const newkeys = [];
      const enter = [];
      const exit = [];
      const update = [];

      for (let item of items) {
        let nkey = this._getKeyForItem(item);
        newkeys.push(nkey);
        if (nkey in this._selectionMap) {
          update.push(item);
        } else {
          enter.push(item);
        }
      }
      for (let oldkey in this._selectionMap) {
        if (!(newkeys.indexOf(oldkey) > -1)) {
          exit.push(this._selectionMap[oldkey]);
        }
      }

      // for (let ex of exit) {
      //     this.deselect(ex);
      // }
      // for(let en of enter){
      //     this.select(en);
      // }

      // if the 2d is exactly the same, return without changing anything
      if (update.length === items.length && update.length === this.nSelected) {
        if (updateCallback) {
          for (let up of update) {
            updateCallback(up, this);
          }
        }
        return;
      }

      let newmap: { [key: string]: T } = {};
      for (let up of update) {
        newmap[this._getKeyForItem(up)] = up;
      }
      for (let n of enter) {
        newmap[this._getKeyForItem(n)] = n;
      }
      this._selectionMap = newmap;

      if (exitCallback) {
        for (let ex of exit) {
          exitCallback(ex, this);
        }
      }
      if (enterCallback) {
        for (let en of enter) {
          enterCallback(en, this);
        }
      }
      if (updateCallback) {
        for (let up of update) {
          updateCallback(up, this);
        }
      }
      return;
    }
  }
}
