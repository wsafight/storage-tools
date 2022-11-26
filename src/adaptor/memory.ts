import { StorageAdaptor } from "../utils"

export class MemoryAdaptor implements StorageAdaptor {
    readonly cache = new Map()

    getItem(key: string) {
        return this.cache.get(key)
    }

    setItem(key: string, value: string) {
        this.cache.set(key, value)
    }
}