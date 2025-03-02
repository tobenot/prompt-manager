import { Prompt, PromptCategory, Tag } from '../types';

// 数据库名称和版本
const DB_NAME = 'promptManagerDB';
const DB_VERSION = 1;

// 存储对象名称
const STORES = {
  PROMPTS: 'prompts',
  CATEGORIES: 'categories',
  TAGS: 'tags',
  SETTINGS: 'settings',
};

// 打开数据库连接
const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // 数据库升级时创建对象存储
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // 创建提示词存储
      if (!db.objectStoreNames.contains(STORES.PROMPTS)) {
        const promptStore = db.createObjectStore(STORES.PROMPTS, { keyPath: 'id' });
        promptStore.createIndex('categoryId', 'categoryId', { unique: false });
        promptStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
        promptStore.createIndex('isFavorite', 'isFavorite', { unique: false });
        promptStore.createIndex('isPinned', 'isPinned', { unique: false });
        promptStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
      
      // 创建分类存储
      if (!db.objectStoreNames.contains(STORES.CATEGORIES)) {
        db.createObjectStore(STORES.CATEGORIES, { keyPath: 'id' });
      }
      
      // 创建标签存储
      if (!db.objectStoreNames.contains(STORES.TAGS)) {
        db.createObjectStore(STORES.TAGS, { keyPath: 'id' });
      }
      
      // 创建设置存储
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('数据库打开失败:', event);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

// 基础数据库操作
const dbOperation = <T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDatabase();
      const transaction = db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      
      const request = operation(store);
      
      request.onsuccess = () => {
        resolve(request.result);
        db.close();
      };
      
      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
        db.close();
      };
    } catch (error) {
      reject(error);
    }
  });
};

// 提示词相关操作
export const promptsDB = {
  // 获取所有提示词
  getAll: (): Promise<Prompt[]> => {
    return dbOperation<Prompt[]>(STORES.PROMPTS, 'readonly', (store) => store.getAll());
  },
  
  // 获取单个提示词
  getById: (id: string): Promise<Prompt | undefined> => {
    return dbOperation<Prompt | undefined>(STORES.PROMPTS, 'readonly', (store) => store.get(id));
  },
  
  // 添加提示词
  add: (prompt: Prompt): Promise<IDBValidKey> => {
    return dbOperation<IDBValidKey>(STORES.PROMPTS, 'readwrite', (store) => store.add(prompt));
  },
  
  // 更新提示词
  update: (prompt: Prompt): Promise<IDBValidKey> => {
    return dbOperation<IDBValidKey>(STORES.PROMPTS, 'readwrite', (store) => store.put(prompt));
  },
  
  // 删除提示词
  delete: (id: string): Promise<undefined> => {
    return dbOperation<undefined>(STORES.PROMPTS, 'readwrite', (store) => store.delete(id));
  },
  
  // 按分类获取提示词
  getByCategory: (categoryId: string): Promise<Prompt[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await openDatabase();
        const transaction = db.transaction(STORES.PROMPTS, 'readonly');
        const store = transaction.objectStore(STORES.PROMPTS);
        const index = store.index('categoryId');
        const request = index.getAll(categoryId);
        
        request.onsuccess = () => {
          resolve(request.result);
          db.close();
        };
        
        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
          db.close();
        };
      } catch (error) {
        reject(error);
      }
    });
  },
  
  // 按标签获取提示词
  getByTag: (tag: string): Promise<Prompt[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await openDatabase();
        const transaction = db.transaction(STORES.PROMPTS, 'readonly');
        const store = transaction.objectStore(STORES.PROMPTS);
        const index = store.index('tags');
        const request = index.getAll(tag);
        
        request.onsuccess = () => {
          resolve(request.result);
          db.close();
        };
        
        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
          db.close();
        };
      } catch (error) {
        reject(error);
      }
    });
  },
};

// 分类相关操作
export const categoriesDB = {
  // 获取所有分类
  getAll: (): Promise<PromptCategory[]> => {
    return dbOperation<PromptCategory[]>(STORES.CATEGORIES, 'readonly', (store) => store.getAll());
  },
  
  // 获取单个分类
  getById: (id: string): Promise<PromptCategory | undefined> => {
    return dbOperation<PromptCategory | undefined>(STORES.CATEGORIES, 'readonly', (store) => store.get(id));
  },
  
  // 添加分类
  add: (category: PromptCategory): Promise<IDBValidKey> => {
    return dbOperation<IDBValidKey>(STORES.CATEGORIES, 'readwrite', (store) => store.add(category));
  },
  
  // 更新分类
  update: (category: PromptCategory): Promise<IDBValidKey> => {
    return dbOperation<IDBValidKey>(STORES.CATEGORIES, 'readwrite', (store) => store.put(category));
  },
  
  // 删除分类
  delete: (id: string): Promise<undefined> => {
    return dbOperation<undefined>(STORES.CATEGORIES, 'readwrite', (store) => store.delete(id));
  },
};

// 标签相关操作
export const tagsDB = {
  // 获取所有标签
  getAll: (): Promise<Tag[]> => {
    return dbOperation<Tag[]>(STORES.TAGS, 'readonly', (store) => store.getAll());
  },
  
  // 获取单个标签
  getById: (id: string): Promise<Tag | undefined> => {
    return dbOperation<Tag | undefined>(STORES.TAGS, 'readonly', (store) => store.get(id));
  },
  
  // 添加标签
  add: (tag: Tag): Promise<IDBValidKey> => {
    return dbOperation<IDBValidKey>(STORES.TAGS, 'readwrite', (store) => store.add(tag));
  },
  
  // 更新标签
  update: (tag: Tag): Promise<IDBValidKey> => {
    return dbOperation<IDBValidKey>(STORES.TAGS, 'readwrite', (store) => store.put(tag));
  },
  
  // 删除标签
  delete: (id: string): Promise<undefined> => {
    return dbOperation<undefined>(STORES.TAGS, 'readwrite', (store) => store.delete(id));
  },
};

// 设置相关操作
export const settingsDB = {
  // 获取设置
  get: (id: string = 'user-settings'): Promise<any | undefined> => {
    return dbOperation<any | undefined>(STORES.SETTINGS, 'readonly', (store) => store.get(id));
  },
  
  // 保存设置
  save: (settings: any, id: string = 'user-settings'): Promise<IDBValidKey> => {
    const data = { ...settings, id };
    return dbOperation<IDBValidKey>(STORES.SETTINGS, 'readwrite', (store) => store.put(data));
  },
};

// 导出数据库操作对象
export default {
  prompts: promptsDB,
  categories: categoriesDB,
  tags: tagsDB,
  settings: settingsDB,
}; 