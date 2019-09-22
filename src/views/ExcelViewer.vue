<template>
  <v-row no-gutters>
    <v-col>
      <v-expansion-panels accordion v-model="panel">
        <v-expansion-panel>
          <v-expansion-panel-header>
            FILE
            <span v-if="panel > 0">"{{ filename }}"</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-file-input accept=".xlsx" @change="load" />
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            HEADER SETTINGS
            <span v-if="panel > 1">"{{ sheetname }}" {{ headerRow }}</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row no-gutters>
              <v-col cols="10" md="3">
                <v-select
                  v-model="sheetname"
                  :items="sheetnames"
                  label="sheet name"
                />
              </v-col>
              <v-col cols="1">
                <v-text-field
                  v-model.number="headerRow"
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
          <v-expansion-panel-header>
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
          <v-expansion-panel-header>
            CONTENT
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row no-gutters>
              <v-col cols="12">
                <v-pagination
                  :length="dataLength"
                  :total-visible="7"
                  v-model="currentPage"
                ></v-pagination>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-card v-for="row of currentRow" :key="row.key">
                  <v-card-title>{{ getHeader(row.key) }}</v-card-title>
                  <v-card-text>{{ row.value }}</v-card-text>
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

interface KV {
  key: number;
  value: string;
}

@Component({})
export default class ExcelViewer extends Vue {
  panel: number = 0;
  filename: string = "";
  workbook: XLSX.WorkBook | null = null;
  sheetname: string = "";
  sheet: XLSX.Sheet | null = null;
  range: XLSX.Range | null = null;
  headerRow: number = 0;
  currentPage: number = 1;
  filterColumn: KV | null = null;

  get sheetnames(): string[] {
    if (this.workbook) {
      return this.workbook.SheetNames;
    } else {
      return [""];
    }
  }

  get headers(): KV[] {
    const headerData: KV[] = [];
    if (this.headerRow !== null) {
      const row = this.getSheetRow(this.headerRow);
      if (row) {
        row.forEach((x, index) => {
          if (x && x.w) {
            headerData.push({ key: index, value: x.w });
          }
        });
      }
    }
    return headerData;
  }

  get dataLength(): number {
    if (this.workbook && this.range) {
      return this.range.e.r - this.headerRow;
    }
    return 0;
  }

  get currentRow() {
    const data: KV[] = [];
    const row = this.getSheetRow(this.headerRow + this.currentPage);
    if (row) {
      row.forEach((x, index) => {
        if (x && x.w) {
          data.push({ key: index, value: x.w });
        }
      });
    }
    return data;
  }

  getHeader(num: number) {
    if (this.headers) {
      const cell = this.headers.filter(x => x.key === num);
      if (cell && cell[0] && cell[0].value) {
        return cell[0].value;
      }
      return "";
    }
  }

  getSheetRow(num: number) {
    if (this.sheet && this.range && num <= this.range.e.r) {
      const row: (XLSX.CellObject | undefined)[] = [];
      for (let i = 0; i < this.range.e.c; i++) {
        row.push(this.sheet[XLSX.utils.encode_cell({ r: num, c: i })]);
      }
      return row;
    }
  }

  @Watch("sheetname")
  setSeet() {
    if (this.workbook && this.sheetname) {
      this.sheet = this.workbook.Sheets[this.sheetname];
      this.range = XLSX.utils.decode_range(this.sheet["!ref" as string]);
    }
  }

  async load(payload: File) {
    this.filename = payload.name;
    const reader = new FileReader();
    reader.onload = e => {
      if (e && e.target) {
        const xlsxData = XLSX.read(e.target.result, { type: "array" });
        this.workbook = xlsxData;
        this.sheetname = xlsxData.SheetNames[0];
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
