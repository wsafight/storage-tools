export const invariant = (condition: boolean, errorMsg: string) => {
  if (condition) {
    throw new Error(errorMsg);
  }
}

export const getCurrentSecond = () => (new Date()).getTime() / 1000

export interface StorageAdaptor {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}

export interface DataStore<T> {
  data: T
  version: number
  createdOn: number
  modifiedOn: number
  [key: string]: any
}

export const EMPTY_STORE: DataStore<null> = {
  createdOn: 0,
  modifiedOn: 0,
  version: 0,
  data: null
}
