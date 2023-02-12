import { ListStorageHelper, MemoryAdaptor } from "../src";

describe('list-store-helper', () => {

  const store = new ListStorageHelper({
    // 多账号用户
    storageKey: `utils.addressList.1`,
    // 当前版本，可以后端传入
    version: 1,
    // 超时，单位为 秒
    timeout: 60 * 60 * 24,
    adapter: new MemoryAdaptor(),
    key: 'searchVal'
  })

  it('[]', () => {
    const data = store.getData()
    expect(data).toEqual([]);
  })

  it('set Val', () => {
    store.setItem({
      searchVal: '123'
    })
    expect(store.getData()).toEqual([{
      searchVal: '123'
    }]);
  })

  it('set Val', () => {
    store.setItem({
      searchVal: '456'
    })
    expect(store.getData()).toEqual([
      {
        searchVal: '456'
      },
      {
        searchVal: '123'
      }
    ]);
  })


  it('set Val', () => {
    store.setItem({
      searchVal: '123'
    })
    expect(store.getData()).toEqual([
      {
        searchVal: '123'
      },
      {
        searchVal: '456'
      }
    ]);
  })

  it('set Val', () => {
    store.setItem({
      searchVal: '123'
    })
    for(let i = 0; i < 100; i++) {
      store.setItem({ searchVal: i })
    }
    expect(store.getData().length).toEqual(10);
  })

})
