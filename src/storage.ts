import { isLocal } from "./config";

export interface Options {
  dob: string;
  expectancy: number;
}

const DEFAULT_OPTIONS: Options = {
  dob: "1985-10-26",
  expectancy: 80,
};

const storage = {
  get: (callback: (options: Options) => void) => {
    if (isLocal) {
      callback(DEFAULT_OPTIONS);
    } else {
      // @ts-ignore
      chrome.storage.sync.get(DEFAULT_OPTIONS, callback);
    }
  },
  set: (options: Options, callback: () => void) => {
    if (isLocal) {
      callback();
    } else {
      // @ts-ignore
      chrome.storage.sync.set(options, callback);
    }
  },
};

const loadOptionsFromStorage = (callback: (options: Options) => void) => {
  storage.get(callback);
};

const saveOptionsToStorage = (options: Options, callback: () => void) => {
  storage.set(options, callback);
};

export { loadOptionsFromStorage, saveOptionsToStorage, DEFAULT_OPTIONS };
