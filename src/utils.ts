export const invariant = (condition: boolean, errorMsg: string) => {
  if (condition) {
    throw new Error(errorMsg);
  }
};

export const getCurrentSecond = () =>
  parseInt(`${new Date().getTime() / 1000}`, 10);

export interface StorageAdaptor {
  getItem: (key: string) => string | Promise<string> | null;
  setItem: (key: string, value: string) => void;
}

export type DataStoreInfo = 'version' | 'createdOn' | 'modifiedOn';

export interface DataStore<T> {
  data: T | null;
  version: number;
  createdOn: number;
  modifiedOn: number;
  [key: string]: any;
}

export const getEmptyDataStore = (version: number): DataStore<any> => {
  const currentSecond = getCurrentSecond();
  return {
    createdOn: currentSecond,
    modifiedOn: currentSecond,
    version,
    data: null,
  };
};

export interface CreateDeferredPromiseResult<T> {
  currentPromise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

type CreateDeferredPromise = <TValue>() => CreateDeferredPromiseResult<TValue>;

export const createDeferredPromise: CreateDeferredPromise = <T>() => {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: any) => void;

  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  return {
    currentPromise: promise,
    resolve,
    reject,
  };
};

const isObject = (value: any) =>
  value !== null && (typeof value === 'object' || typeof value === 'function');

export const isPromise = (val: any): val is Promise<string> => {
  return (
    val instanceof Promise ||
    (isObject(val) &&
      typeof val.then === 'function' &&
      typeof val.catch === 'function')
  );
};
