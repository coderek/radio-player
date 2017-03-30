import {Injectable} from "@angular/core";

@Injectable()
export class StorageService {

  store: Storage = null;

  constructor() {
    this.store = localStorage;
  }

  put(key, val) {
    this.store.setItem(key, JSON.stringify(val));
  }

  get(key) {
    let val = this.store.getItem(key);
    try {
      return JSON.parse(val);
    } catch (e) {
      return val;
    }
  }

  has(key) {
    return this.store.getItem(key) != null;
  }
}
