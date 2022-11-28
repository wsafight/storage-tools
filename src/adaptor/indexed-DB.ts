import { StorageAdaptor } from "../utils"

export class IndexedDBAdaptor implements StorageAdaptor {

    constructor() {
        
    }
 
    getItem(key: string) {
        return null
    }

    setItem(key: string, value: string) {
        console.log(key)
        console.log(value)
    }
}