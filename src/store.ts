import Vuex from 'vuex';
import { Module, createStore as cs } from 'vuex-smart-module';

import { xlsxFileModule } from '@/store/xlsxFileModule';

export function createStore() {
  const rootModule = new Module({
    modules: {
      xlsxFileModule
    }
  });

  return cs(rootModule);
}
