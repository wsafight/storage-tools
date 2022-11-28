import { StorageHelper, StorageHelperParams } from './storage-helper'

interface ListStorageHelperParams extends StorageHelperParams {
  key: string
  maxCount: number
  moveTopWhenModified: boolean
  unshiftWhenAdded: boolean
}

const STORE_MAX_COUNT: number = 10

export class ListStorageHelper<T> extends StorageHelper<T[]> {
  readonly maxCount: number = 10
  readonly key: string = 'id'
  readonly moveTopWhenModified: boolean = false
  readonly unshiftWhenAdded: boolean = false

  constructor ({
    maxCount, 
    key, 
    moveTopWhenModified = false, 
    unshiftWhenAdded = false,
    storageKey, 
    version,
    storage,
    timeout
  }: ListStorageHelperParams) {
    super({ storageKey, version, storage, timeout })
    this.maxCount = maxCount || STORE_MAX_COUNT
    this.key = key
    this.moveTopWhenModified = moveTopWhenModified
    this.unshiftWhenAdded = unshiftWhenAdded
  }

  load (forceLoad: boolean) {
    super.load(forceLoad)
    if (!this.store!.data) {
      this.store!.data = []
    }
    this.checkThenRemoveItem(this.store!.data)
    return this
  }

  getData = () => {
    let items = super.getData()
    if (!items) {
      items = []
    }
    return items
  }

  checkThenRemoveItem = (items: T[]) => {
    if(items.length <= this.maxCount) {
      return;
    }
    items.splice(this.maxCount, items.length - this.maxCount)
  }

  setItem (item: T) {
    if (!this.store) {
      throw new Error('Please complete the loading load first')
    }

    const items = this.getData()

    const index = items.findIndex((x: any) => x[this.key] === (item as any)[this.key])

    if (index > -1) {
      if (this.moveTopWhenModified) {
        items.splice(index, 1)
        items.unshift(item)
      } else {
        items[index] = { ...items[index], ...item }
      }
    } else {
      if (this.unshiftWhenAdded) {
        items.unshift(item)
      } else {
        items.push(item)
      }
    }
    this.checkThenRemoveItem(items)
    
    return this
  }

  removeItem (itemKey: string) {
    if (!this.store) {
      throw new Error('Please complete the loading load first')
    }
    const items = this.getData()
    const index = items.findIndex((x: any) => x[this.key] === itemKey)
    if (index > -1) {
      items.splice(index, 1)
    }
    return this
  }

  setItems(items: T[]) {
    if (!this.store) {
      throw new Error('Please complete the loading load first')
    }
    this.store.data = items || []
  }

  getItems() {
    if (!this.store) {
      throw new Error('Please complete the loading load first')
    }
    return this.getData()
  }
}
