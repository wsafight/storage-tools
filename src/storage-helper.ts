import {
  isPromise,
  createDeferredPromise,
  CreateDeferredPromiseResult,
  DataStore,
  getCurrentSecond,
  getEmptyDataStore,
  StorageAdaptor,
  DataStoreInfo,
} from './utils'

export interface StorageHelperParams {
  storageKey: string
  version?: number
  adapter?: StorageAdaptor
  timeout?: number
}

export class StorageHelper<T> {
  private readonly storageKey: string
  private readonly version: number
  private readonly timeout: number = -1

  readonly adapter: StorageAdaptor

  store: DataStore<T> | null = null

  ready: CreateDeferredPromiseResult<boolean> = createDeferredPromise<boolean>()

  constructor({ storageKey, version, adapter, timeout }: StorageHelperParams) {
    this.storageKey = storageKey
    this.version = version || 1
    this.adapter =
      adapter && 'getItem' in adapter && 'setItem' in adapter
        ? adapter
        : localStorage

    if (typeof timeout === 'number' && timeout > 0) {
      this.timeout = timeout
    }

    this.load()
  }

  load(
    {
      refresh = false,
    }: {
      refresh: boolean
    } = { refresh: false }
  ) {
    if (!refresh && this.store) {
      return
    }

    const result: Promise<string> | string | null = this.adapter.getItem(
      this.storageKey
    )

    if (isPromise(result)) {
      result
        .then((res) => {
          this.initStore(res)
          this.ready.resolve(true)
        })
        .catch(() => {
          this.initStore(null)
          this.ready.resolve(true)
        })
    } else {
      this.initStore(result)
      this.ready.resolve(true)
    }
  }

  private initStore(storeStr: string | null) {
    if (!storeStr) {
      this.store = getEmptyDataStore(this.version)
      return
    }

    let store: DataStore<T> | null = null

    try {
      store = JSON.parse(storeStr)

      if (!store || !('data' in store)) {
        store = getEmptyDataStore(this.version)
      } else if (store.version !== this.version) {
        store = this.upgrade(store)
      }
    } catch (_e) {
      store = getEmptyDataStore(this.version)
    }

    this.store = store || getEmptyDataStore(this.version)
  }

  whenReady() {
    return this.ready.currentPromise
  }

  setData(data: T) {
    if (!this.store) {
      return
    }
    this.store.data = data
  }

  getData(): T | null {
    if (!this.store) {
      return null
    }
    if (this.timeout < 0) {
      return this.store?.data
    }
    if (getCurrentSecond() < (this.store?.modifiedOn || 0) + this.timeout) {
      return this.store?.data
    }
    return null
  }

  commit() {
    const store = this.store || getEmptyDataStore(this.version)
    store.version = this.version

    const now = getCurrentSecond()
    if (!store.createdOn) {
      store.createdOn = now
    }
    store.modifiedOn = now

    return this.adapter.setItem(this.storageKey, JSON.stringify(store))
  }

  get(key: DataStoreInfo) {
    return this.store?.[key]
  }

  upgrade(store: DataStore<T>): DataStore<T> {
    const now = getCurrentSecond()
    return {
      version: this.version,
      data: null,
      createdOn: store.createdOn || now,
      modifiedOn: now,
    }
  }
}
