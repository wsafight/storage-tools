import { StorageAdaptor } from "../utils"

interface IndexedDBAdaptorParams {
  dbName: string
  storeName: string
  IDBOptions: IDBObjectStoreParameters
  IDBIndexList: {
    name: string
    keyPath: string | string[]
    options?: IDBIndexParameters
  }[]
}

export class IndexedDBAdaptor implements StorageAdaptor {

  readonly db: IDBDatabase
  readonly storeName: string

  constructor({
    dbName,
    storeName,
    IDBOptions = {},
    IDBIndexList = []
  }: IndexedDBAdaptorParams) {
    this.storeName = storeName
    const request = indexedDB.open(dbName)
    const { result } = request

    this.db = result

    request.onupgradeneeded = () => {
      if (!result.objectStoreNames.contains(storeName)) {
        const store = result.createObjectStore(storeName, { ...IDBOptions })
        IDBIndexList.forEach(index => {
          store.createIndex(index.name, index.keyPath, index.options)
        })
      }
    }
  }


  getItem(key: string): string {
    const value = this.db.transaction(this.storeName).objectStore(this.storeName).get(key)
    return value.result?.data || ''
  }

  setItem(key: string, value: string) {
    console.log(key)
    console.log(value)
  }
}