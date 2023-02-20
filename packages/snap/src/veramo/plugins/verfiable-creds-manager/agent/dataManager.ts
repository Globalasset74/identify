import { IAgentPlugin } from '@veramo/core';
import { v4 as uuidv4 } from 'uuid';
import { AbstractDataStore } from '../data-store/abstractDataStore';
import {
  IDataManager,
  IDataManagerClearArgs,
  IDataManagerClearResult,
  IDataManagerDeleteArgs,
  IDataManagerDeleteResult,
  IDataManagerQueryArgs,
  IDataManagerQueryResult,
  IDataManagerSaveArgs,
  IDataManagerSaveResult,
} from '../types/IDataManager';

export class DataManager implements IAgentPlugin {
  readonly methods: IDataManager = {
    save: this.save.bind(this),
    query: this.query.bind(this),
    delete: this.delete.bind(this),
    clear: this.clear.bind(this),
  };

  private stores: Record<string, AbstractDataStore>;

  constructor(options: { store: Record<string, AbstractDataStore> }) {
    this.stores = options.store;
  }

  public async save(
    args: IDataManagerSaveArgs,
  ): Promise<IDataManagerSaveResult[]> {
    const { data, options } = args;
    let { store } = options;
    if (typeof store === 'string') {
      store = [store];
    }

    const id = uuidv4();

    const res: IDataManagerSaveResult[] = [];
    for (const storeName of store) {
      const storePlugin = this.stores[storeName];
      if (!storePlugin) {
        throw new Error(`Store plugin ${storeName} not found`);
      }

      try {
        const result = await storePlugin.save({ data, options, id });
        res.push({ id: result, store: storeName });
      } catch (e) {
        console.log(e);
      }
    }
    return res;
  }

  public async query(
    args: IDataManagerQueryArgs,
  ): Promise<IDataManagerQueryResult[]> {
    const { filter = { type: 'none', filter: {} }, options } = args;
    let store;
    let returnStore = true;
    if (options === undefined) {
      store = Object.keys(this.stores);
    } else {
      if (options.store !== undefined) {
        store = options.store;
      } else {
        store = Object.keys(this.stores);
      }

      if (options.returnStore !== undefined) {
        returnStore = options.returnStore;
      }
    }

    if (typeof store === 'string') {
      store = [store];
    }
    let res: IDataManagerQueryResult[] = [];

    for (const storeName of store) {
      const storePlugin = this.stores[storeName];
      if (!storePlugin) {
        throw new Error(`Store plugin ${storeName} not found`);
      }

      try {
        const result = await storePlugin.query({ filter });
        const mappedResult = result.map((r) => {
          if (returnStore) {
            return {
              data: r.data,
              metadata: { id: r.metadata.id, store: storeName },
            };
          }
          return { data: r.data, metadata: { id: r.metadata.id } };
        });
        res = [...res, ...mappedResult];
      } catch (e) {
        console.log(e);
      }
    }
    return res;
  }

  public async delete(
    args: IDataManagerDeleteArgs,
  ): Promise<IDataManagerDeleteResult[]> {
    const { id, options } = args;
    let store;
    if (options === undefined) {
      store = Object.keys(this.stores);
    } else {
      store = options.store;
    }

    if (typeof store === 'string') {
      store = [store];
    }

    if (store === undefined) {
      store = Object.keys(this.stores);
    }
    const res: IDataManagerDeleteResult[] = [];
    for (const storeName of store) {
      const storePlugin = this.stores[storeName];
      if (!storePlugin) {
        throw new Error(`Store plugin ${storeName} not found`);
      }

      try {
        const result = await storePlugin.delete({ id });
        res.push({ id, removed: result, store: storeName });
      } catch (e) {
        console.log(e);
      }
    }
    return res;
  }

  public async clear(
    args: IDataManagerClearArgs,
  ): Promise<IDataManagerClearResult[]> {
    const { filter = { type: 'none', filter: {} }, options } = args;
    let store;
    if (options === undefined) {
      store = Object.keys(this.stores);
    } else if (options.store !== undefined) {
      store = options.store;
    } else {
      store = Object.keys(this.stores);
    }

    if (typeof store === 'string') {
      store = [store];
    }
    const res: IDataManagerClearResult[] = [];
    for (const storeName of store) {
      const storePlugin = this.stores[storeName];
      if (!storePlugin) {
        throw new Error(`Store plugin ${storeName} not found`);
      }

      try {
        const result = await storePlugin.clear({ filter });
        res.push({ removed: result, store: storeName });
      } catch (e) {
        console.log(e);
      }
    }
    return res;
  }
}
