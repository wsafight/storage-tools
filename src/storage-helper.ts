import { DataStore, EMPTY_STORE, getCurrentSecond, StorageAdaptor } from "./utils"

export interface StorageHelperParams {
  storageKey: string
  version: number
  storage?: StorageAdaptor
  timeout?: number
}

export class StorageHelper<T> {
  private storageKey: string;
  private version: number;
  protected store: DataStore<T> | null = null
  protected timeout: number = -1

  readonly storage: StorageAdaptor = localStorage
  
  constructor({ storageKey, version, storage, timeout }: StorageHelperParams) {
    this.storageKey = storageKey
    this.version = version

    if (storage && 'getItem' in storage && 'setItem' in storage) {
      this.storage = storage
    }

    if (typeof timeout === 'number' && timeout > 0) {
      this.timeout = timeout
    }
  }

  load (forceLoad?: boolean) {
    if (!forceLoad && this.store) {
      return this
    }
    const stringifyData: string | null = this.storage.getItem(this.storageKey)
    let store = stringifyData ? JSON.parse(stringifyData) : {}
    if (stringifyData && store.version !== this.version) {
      store = this.upgrade()
    }
    this.store = store || {...EMPTY_STORE}
    return this
  }

  ensureLoad() {
    this.load()
    return this
  }

  setData(data: T) {
    if (this.store) {
      this.store.data = data
    }
    return this
  }

  getData () {
    if (this.timeout < 0) {
      return this.store?.data
    }
    if (getCurrentSecond() < (this.store?.modifiedOn || 0) + this.timeout) {
      return this.store?.data
    }
    return null
  }

  commit () {
    const store = this.store || EMPTY_STORE
    store.version = this.version
    const now = getCurrentSecond()
    if (!store.createdOn) {
      store.createdOn = now
    }
    store.modifiedOn = now
    this.storage.setItem(this.storageKey, JSON.stringify(store))
    return this
  }

  get (key: string) {
    return this.store?.[key]
  }

  upgrade () {
    return null
  }

}
