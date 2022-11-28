export const invariant = (condition: boolean, errorMsg: string) => {
  if (condition) {
    throw new Error(errorMsg)
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

export const getEmptyDataStore = (): DataStore<any> => {
  return {
    createdOn: 0,
    modifiedOn: 0,
    version: 0,
    data: null
  }
}


export interface CreateDeferredPromiseResult<T> {
  currentPromise: Promise<T>
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
}


type CreateDeferredPromise = <TValue>() => CreateDeferredPromiseResult<TValue>

export const createDeferredPromise: CreateDeferredPromise = <T>() => {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: any) => void

  const promise = new Promise<T>((res, rej) => {
      resolve = res
      reject = rej
  })

  return {
      currentPromise: promise,
      resolve,
      reject
  }
}


const isObject = (value: any) => value !== null &&
	(typeof value === 'object' || typeof value === 'function')

export const isPromise = (val: any): val is Promise<string> => {
	return val instanceof Promise ||
		(
			isObject(val) &&
			typeof val.then === 'function' &&
			typeof val.catch === 'function'
		)
}