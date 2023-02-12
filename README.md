# storage-tools

[![Build Status](https://www.travis-ci.org/wsafight/storage-tools.svg?branch=main)](https://www.travis-ci.org/wsafight/storage-tools)
[![NPM Version](https://badgen.net/npm/v/storage-tools)](https://www.npmjs.com/package/storage-tools)

Read this in other languages:
[English](https://github.com/wsafight/storage-tools/blob/main/README.EN.md)

基于实际业务的存储工具库

开发历程可以参考博客 [手写一个存储工具库](https://github.com/wsafight/personBlog/issues/55)

## 特性

- [x] 默认支持浏览器 Storage 功能存储
- [x] 支持自定义存储配置
- [x] 支持数组类型数据存取
- [x] 支持版本比对和超时机制
- [x] 单元测试
- [ ] 支持更加复杂的储存机制

## 安装

```bash
npm install storage-tools
```

或者

```bash
yarn add storage-tools
```

## 用法

### 存储工具类 StorageHelper

传递各种配置以构建存储数据

#### 参数

| 参数         | 说明                           | 类型     | 默认值          |
| :--------- | :--------------------------- | :----- | :----------- |
| adapter    | 适配器，需要有 setItem 和 getItem 方法 | Class  | localStorage |
| storageKey | 唯一确定存储数据的 key                | string | -            |
| version    | 当前数据版本                       | number | 1            |
| timeout    | 超时时间                         | number | -            |

#### 例子

```ts
import { IndexedDBAdaptor, StorageHelper } from "storage-tools";

// 当前用户 id
const userId = "1";

const store = new StorageHelper({
  // 多账号用户
  storageKey: `utils.addressList.${userId}`,
  // 当前版本，可以后端传入
  version: 1,
  // 超时，单位为 秒
  timeout: 60 * 60 * 24,
});

const data = store.getData();
// 没有数据，表明没有过期或者没有存储过
if (data === null) {
  // 进行业务请求
  // 存储数据到内存中去，之后的 getData 都可以获取到数据
  store.setData(val);
  // 提交到 localStorage
  store.commit();
}

const storeAsync = new StorageHelper({
  storageKey: `utils.addressList.${userName}`,
  version: 1,
  timeout: 60 * 60 * 24,
  adapter: new IndexedDBAdaptor({
    dbName: "db",
    storeName: "test",
  }),
});

// IndexedDB 只能异步获取，所以现在只能等待获取构建获取完成
storeAsync.whenReady().then(() => {
  const data = storeAsync.getData();
});

// 也可以基于 StorageHelper 构建业务类
class TemplatesStorage extends StorageHelper {
  // 传入 userId
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

// 也可以自定义适配器
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

### 列表存储工具类 ListStorageHelper

传递各种配置以构建数组类型数据(前端储存历史查询数据)

#### 参数

| 参数                    | 说明                           | 类型      | 默认值          |
| :-------------------- | :--------------------------- | :------ | :----------- |
| adapter               | 适配器，需要有 setItem 和 getItem 方法 | Class   | localStorage |
| storageKey            | 唯一确定存储数据的 key                | string  | -            |
| version               | 当前数据版本                       | number  | 1            |
| maxCount              | 列表存储的最大数量                    | number  | 10           |
| key                   | 数组主键                         | string  | 'id'         |
| isMoveTopWhenModified | 当前修改是否移动到最前                  | boolean | true         |
| isUnshiftWhenAdded    | 是否插入到最前面                     | boolean | true         |

#### 例子

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

## 升级日志

- 0.0.3 基本可用，支持 StorageHelper 以及 ListStorageHelper
