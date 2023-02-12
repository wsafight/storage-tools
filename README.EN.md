# storage-tools

[![Build Status](https://www.travis-ci.org/wsafight/storage-tools.svg?branch=main)](https://www.travis-ci.org/wsafight/storage-tools)
[![NPM Version](https://badgen.net/npm/v/storage-tools)](https://www.npmjs.com/package/storage-tools)

A storage tool library based on real business

## Features

- [x] Browser storage function storage is supported by default
- [x] Support custom storage configuration
- [x] Support array type data access
- [x] Support version comparison and timeout mechanism
- [x] Unit testing
- [ ] Support more complex storage mechanism

## Install

```bash
npm install storage-tools
```

or

```bash
yarn add storage-tools
```

## Usage

### Storage tool class StorageHelper

Pass various configurations to build stored data

#### parameter

| parameter  | desc                                             | type   | default      |
| :--------- | :----------------------------------------------- | :----- | :----------- |
| adapter    | Adapter, requires setItem and getItem methods    | Class  | localStorage |
| storageKey | The key that uniquely identifies the stored data | string | -            |
| version    | Current data version                             | number | 1            |
| timeout    | Timeout                                          | number | -            |

#### example

```ts
import { IndexedDBAdaptor, StorageHelper } from "storage-tools";

// Current user ID
const userId = "1";

const store = new StorageHelper({
  // Multi-account user
  storageKey: `utils.addressList.${userId}`,
  // The current version can be imported from the back end
  version: 1,
  // Timeout in seconds
  timeout: 60 * 60 * 24,
});

const data = store.getData();
// No data, indicating no expiration or storage
if (data === null) {
  // Make a business request
  // Store the data in memory, and the subsequent getData can get the data
  store.setData(val);
  // 提交到 localStorage
  store.commit();
}

const store = new StorageHelper({
  storageKey: `utils.addressList.${userName}`,
  version: 1,
  timeout: 60 * 60 * 24,
  adapter: new IndexedDBAdaptor({
    dbName: "db",
    storeName: "test",
  }),
});

// IndexedDB can only be acquired asynchronously, so now it can only wait for the acquisition build acquisition to complete
store.whenReady().then(() => {
  const data = store.getData();
});

// You can also build business classes based on StorageHelper
class TemplatesStorage extends StorageHelper {
  // Incoming userId
  constructor(userId: number) {
    super({
      storageKey: `templates.${userId}`,
      version: 1,
    });
  }

  getTemplates() {
    return super.getData();
  }

  setTemplats(templates: any[]) {
    super.setData(templates);
    super.commit();
  }
}

// You can also customize the adapter
class RedisAdaptor implements StorageAdaptor {
  getItem(key: string) {
    return $api.request({
      key,
    });
  }

  setItem(key: string, value: string) {
    return $api.request({
      key,
      value,
    });
  }
}
```

### List storage tool class ListStorageHelper

Pass various configurations to build array type data (front end stores
historical query data)

#### parameter

| parameter             | desc                                                   | type    | default      |
| :-------------------- | :----------------------------------------------------- | :------ | :----------- |
| adapter               | Adapter, requires setItem and getItem methods          | Class   | localStorage |
| storageKey            | The key that uniquely identifies the stored data       | string  | -            |
| version               | Current data version                                   | number  | 1            |
| timeout               | Timeout                                                | number  | -            |
| maxCount              | Maximum number of list stores                          | number  | 10           |
| key                   | Array primary key                                      | string  | 'id'         |
| isMoveTopWhenModified | Whether the current modification is moved to the front | boolean | true         |
| isUnshiftWhenAdded    | Insert to the front                                    | boolean | true         |

#### example

```ts
import { IndexedDBAdaptor, ListStorageHelper } from "storage-tools";

const userId = "1";

const store = new StorageHelper({
  storageKey: `utils.addressList.${userId}`,
  version: 1,
  adaptor: new IndexedDBAdaptor({
    dbName: "db",
    storeName: "test",
  }),
  key: "searchVal",
});

store.setItem({ searchVal: "new game" });
// [{
//   searchVal: 'new game'
// }]

store.setItem({ searchVal: "new game2" });
// [{
//   searchVal: 'new game2'
// }, {
//   searchVal: 'new game'
// }]

store.setItem({ searchVal: "new game" });
// [{
//   searchVal: 'new game'
// }, {
//   searchVal: 'new game2'
// }]
```

## Changelog

- 0.0.3 Basically available, supporting StorageHelper and ListStorageHelper
