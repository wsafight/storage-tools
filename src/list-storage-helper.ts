import { StorageHelper, StorageHelperParams } from './storage-helper'

interface ListStorageHelperParams extends StorageHelperParams {
  key?: string
  maxCount?: number
  isMoveTopWhenModified?: boolean
  isUnshiftWhenAdded?: boolean
}

const STORE_MAX_COUNT: number = 10

export class ListStorageHelper<T> extends StorageHelper<T[]> {
  readonly key: string = 'id'
  readonly maxCount: number = STORE_MAX_COUNT

  readonly isUnshiftWhenAdded: boolean = true
  readonly isMoveTopWhenModified: boolean = true

  constructor({
    maxCount,
    key,
    isMoveTopWhenModified = true,
    isUnshiftWhenAdded = true,
    storageKey,
    version,
    adapter,
    timeout,
  }: ListStorageHelperParams) {
    super({ storageKey, version, adapter, timeout })
    this.maxCount = maxCount || STORE_MAX_COUNT
    this.key = key || 'id'
    if (typeof isMoveTopWhenModified === 'boolean') {
      this.isMoveTopWhenModified = isMoveTopWhenModified
    }

    if (typeof this.isUnshiftWhenAdded === 'boolean') {
      this.isUnshiftWhenAdded = isUnshiftWhenAdded
    }
  }

  load(
    {
      refresh = false,
    }: {
      refresh: boolean
    } = { refresh: false }
  ) {
    super.load({ refresh })
    if (!this.store!.data) {
      this.store!.data = []
    }
    return this
  }

  getData = (): T[] => {
    const items = super.getData() || []
    this.checkThenRemoveItem(items)
    return items
  }

  setItem(item: T) {
    if (!this.store) {
      throw new Error('Please complete the loading load first')
    }

    const items = this.getData()

    const index = items.findIndex(
      (x: any) => x[this.key] === (item as any)[this.key]
    )

    if (index > -1) {
      const current = { ...items[index], ...item }
      if (this.isMoveTopWhenModified) {
        items.splice(index, 1)
        items.unshift(current)
      } else {
        items[index] = current
      }
    } else {
      this.isUnshiftWhenAdded ? items.unshift(item) : items.push(item)
    }
    this.checkThenRemoveItem(items)
  }

  removeItem(key: string | number) {
    if (!this.store) {
      throw new Error('Please complete the loading load first')
    }
    const items = this.getData()
    const index = items.findIndex((x: any) => x[this.key] === key)
    if (index > -1) {
      items.splice(index, 1)
    }
  }

  setItems(items: T[]) {
    if (!this.store) {
      return
    }
    this.checkThenRemoveItem(items)
    this.store.data = items || []
  }

  getItems() {
    if (!this.store) {
      return null
    }
    return this.getData()
  }

  checkThenRemoveItem = (items: T[]) => {
    if (items.length <= this.maxCount) {
      return
    }
    items.splice(this.maxCount, items.length - this.maxCount)
  }
}
