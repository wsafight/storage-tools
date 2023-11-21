import { StorageAdaptor } from '../utils';

interface IndexedDBUpgradeInfo {
  options?: IDBObjectStoreParameters;
  indexList?: {
    name: string;
    keyPath: string | string[];
    options?: IDBIndexParameters;
  }[];
}

interface IndexedDBAdaptorParams {
  dbName: string;
  storeName: string;
  upgradeInfo?: IndexedDBUpgradeInfo;
}

function promisifyRequest<T = undefined>(
  request: IDBRequest<T> | IDBTransaction,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    // @ts-expect-error
    const resolveFun = () => resolve(request.result);
    const rejectFun = () => reject(request.error);
    (request as any).oncomplete = resolveFun;
    (request as any).onsuccess = resolveFun;
    (request as any).onabort = rejectFun;
    (request as any).onerror = rejectFun;
  });
}

type UseStore = <T>(
  txMode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => T | PromiseLike<T>,
) => Promise<T>;

const createStore = (
  dbName: string,
  storeName: string,
  upgradeInfo: IndexedDBUpgradeInfo = {},
): UseStore => {
  const request = indexedDB.open(dbName);

  request.onupgradeneeded = () => {
    const { result: store } = request;
    if (!store.objectStoreNames.contains(storeName)) {
      const { options = {}, indexList = [] } = upgradeInfo;
      const store = request.result.createObjectStore(storeName, { ...options });
      indexList.forEach(index => {
        store.createIndex(index.name, index.keyPath, index.options);
      });
    }
  };

  const dbp = promisifyRequest(request);

  return (txMode, callback) =>
    dbp.then(db =>
      callback(db.transaction(storeName, txMode).objectStore(storeName)),
    );
};

export class IndexedDBAdaptor implements StorageAdaptor {
  private readonly store: UseStore;

  constructor({ dbName, storeName, upgradeInfo }: IndexedDBAdaptorParams) {
    this.store = createStore(dbName, storeName, upgradeInfo);
  }

  getItem(key: string): Promise<string> {
    return this.store('readonly', store => promisifyRequest(store.get(key)));
  }

  setItem(key: string, value: string) {
    return this.store('readwrite', store => {
      store.put(value, key);
      return promisifyRequest(store.transaction);
    });
  }
}
