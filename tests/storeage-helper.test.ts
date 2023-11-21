import { StorageHelper, MemoryAdaptor } from '../src';

describe('store-helper', () => {
  const store = new StorageHelper({
    // 多账号用户
    storageKey: `utils.addressList.1`,
    // 当前版本，可以后端传入
    version: 1,
    // 超时，单位为 秒
    timeout: 60 * 60 * 24,
    adapter: new MemoryAdaptor(),
  });

  it('null', () => {
    const data = store.getData();
    expect(data).toEqual(null);
  });

  it('set Val', () => {
    store.setData(123);
    expect(store.getData()).toEqual(123);
  });

  it('set Val no commit', () => {
    store.setData(123);
    expect(store.adapter).toEqual(new MemoryAdaptor());
  });

  it('set Val no commit', () => {
    store.setData(123);
    store.commit();
    const data: string = store.adapter.getItem('utils.addressList.1') as string;
    expect(JSON.parse(data).data).toEqual(123);
  });
});
