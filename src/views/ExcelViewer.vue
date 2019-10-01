<template>
  <v-row no-gutters>
    <v-col>
      <v-expansion-panels accordion focusable v-model="panel">
        <v-expansion-panel>
          <v-expansion-panel-header
            :class="panel > 0 ? 'primary lighten-4' : ''"
          >
            FILE
            <span v-if="panel > 0">"{{ filename }}"</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-file-input accept=".xlsx" @change="load" />
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header
            :class="panel > 1 ? 'primary lighten-4' : ''"
          >
            HEADER SETTINGS
            <span v-if="panel > 1">"{{ sheetname }}" {{ headerRow }}</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row no-gutters>
              <v-col cols="10" md="3">
                <v-select
                  v-model="selectSheet"
                  :items="sheetnames"
                  label="sheet name"
                />
              </v-col>
              <v-col cols="1">
                <v-text-field
                  v-model.number="selectHeaderRow"
                  type="number"
                  label="header row"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-list disabled>
                <v-subheader>HEADERS</v-subheader>
                <v-list-item v-for="h of headers" :key="h.key">
                  <v-list-item-content>
                    <v-list-item-title>{{ h.value }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-row>
            <v-row no-gutters>
              <v-btn @click="panel += 1">DONE</v-btn>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header
            :class="panel > 2 ? 'primary lighten-4' : ''"
          >
            FILTER [NOT WORK]
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row no-gutters>
              <v-col>
                <v-select
                  v-model="filterColumn"
                  :items="headers"
                  item-text="value"
                  item-value="key"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-btn @click="panel += 1">DONE</v-btn>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header
            :class="panel > 3 ? 'primary lighten-4' : ''"
          >
            CONTENT
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row no-gutters>
              <v-col cols="12">
                <v-pagination
                  :length="dataLength"
                  :total-visible="7"
                  v-model="selectCurrentPage"
                ></v-pagination>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-card v-for="(row, index) in currentRow" :key="index">
                  <v-card-title>{{ getHeader(index) }}</v-card-title>
                  <v-card-text v-if="row && row.w">{{ row.w }}</v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import XLSX from "xlsx";

import { xlsxFileModule } from "@/store/xlsxFileModule";

interface KV {
  key: number;
  value: string;
}

const Super = Vue.extend({
  computed: {
    ...xlsxFileModule.mapGetters([
      "filename",
      "sheetname",
      "isFileLoaded",
      "headerRow",
      "currentPage",
      "currentRow",
      "sheetnames",
      "headers",
      "getHeader",
      "dataLength"
    ])
  },
  methods: {
    ...xlsxFileModule.mapActions([
      "setFilename",
      "setWorkBook",
      "setHeaderRow",
      "setCurrentPage",
      "setSheet"
    ])
  }
});

@Component
export default class ExcelViewer extends Super {
  panel: number = 0;
  filterColumn: KV | null = null;

  created() {
    if (this.isFileLoaded) {
      this.panel = 1;
    }
  }

  get selectSheet() {
    return this.sheetname;
  }

  set selectSheet(sheetname: string) {
    this.setSheet(sheetname);
  }

  get selectHeaderRow() {
    return this.headerRow;
  }

  set selectHeaderRow(num: number) {
    this.setHeaderRow(num);
  }

  get selectCurrentPage() {
    return this.currentPage;
  }

  set selectCurrentPage(num: number) {
    this.setCurrentPage(num);
  }

  async load(payload: File) {
    await this.setFilename(payload.name);
    const reader = new FileReader();
    reader.onload = e => {
      if (e && e.target) {
        const xlsxData = XLSX.read(e.target.result, { type: "array" });
        this.setWorkBook(xlsxData);
      }
    };
    await reader.readAsArrayBuffer(payload);
    this.panel += 1;
  }
}
</script>

<style scoped>
.v-card__text {
  width: auto;
}
</style>
