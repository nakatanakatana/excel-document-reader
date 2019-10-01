import Vuex, { Store } from 'vuex';
import { Module, createStore as cs } from 'vuex-smart-module';
import VuexPersistence from 'vuex-persist';

import { xlsxFileModule } from '@/store/xlsxFileModule';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

export function createStore() {
  const rootModule = new Module({
    modules: {
      xlsxFileModule
    }
  });

  return cs(rootModule, { plugins: [vuexLocal.plugin] });
}
