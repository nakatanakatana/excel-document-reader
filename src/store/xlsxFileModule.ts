import { Getters, Mutations, Actions, Module } from 'vuex-smart-module';
import XLSX from 'xlsx';

interface KV {
  key: number;
  value: string;
}

class XLSXFileState {
  filename: string = '';
  workbook: XLSX.WorkBook | null = null;
  sheetname: string = '';
  sheet: XLSX.Sheet | null = null;
  range: XLSX.Range | null = null;
  headerRow: number = 0;
  currentPage: number = 1;
}

class XLSXFileGetters extends Getters<XLSXFileState> {
  get filename(): string {
    return this.state.filename;
  }

  get workbook() {
    return this.state.workbook;
  }

  get sheetname() {
    return this.state.sheetname;
  }

  get sheet() {
    return this.state.sheet;
  }

  get range() {
    return this.state.range;
  }

  get headerRow() {
    return this.state.headerRow;
  }

  get currentPage() {
    return this.state.currentPage;
  }

  get sheetnames(): string[] {
    if (this.state.workbook) {
      return this.state.workbook.SheetNames;
    } else {
      return [''];
    }
  }

  get headers(): KV[] {
    const headerData: KV[] = [];
    if (this.state.headerRow !== null && this.state.sheet && this.state.range) {
      const row = getSheetRow(
        this.state.headerRow,
        this.state.sheet,
        this.state.range
      );
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
    if (this.state.workbook && this.state.range) {
      return this.state.range.e.r - this.state.headerRow;
    }
    return 0;
  }

  get currentRow() {
    if (
      this.state.headerRow &&
      this.state.currentPage &&
      this.state.sheet &&
      this.state.range
    ) {
      return getSheetRow(
        this.state.headerRow + this.state.currentPage,
        this.state.sheet,
        this.state.range
      );
    }
    return [];
  }

  getHeader(num: number) {
    if (this.getters.headers) {
      const cell = this.getters.headers.filter(x => x.key === num);
      if (cell && cell[0] && cell[0].value) {
        return cell[0].value;
      }
    }
    return '';
  }

  getRow(num: number) {
    if (this.state.sheet && this.state.range) {
      return getSheetRow(num, this.state.sheet, this.state.range);
    }
    return [];
  }
}

class XLSXFileMutations extends Mutations<XLSXFileState> {
  setFilename(filename: string) {
    this.state.filename = filename;
  }
  setWorkbook(workbook: XLSX.WorkBook) {
    this.state.workbook = workbook;
    this.state.sheetname = workbook.SheetNames[0];
    this.state.sheet = workbook.Sheets[this.state.sheetname];
    this.state.range = XLSX.utils.decode_range(
      this.state.sheet['!ref' as string]
    );
  }

  setHeaderRow(headerRow: number) {
    this.state.headerRow = headerRow;
  }

  setCurrentPage(currentPage: number) {
    this.state.currentPage = currentPage;
  }

  setSheet(sheetname: string) {
    this.state.sheetname = sheetname;
    if (this.state.workbook) {
      this.state.sheet = this.state.workbook.Sheets[sheetname];
      this.state.range = XLSX.utils.decode_range(
        this.state.sheet['!ref' as string]
      );
    }
  }
}

class XLSXFileActions extends Actions<
  XLSXFileState,
  XLSXFileGetters,
  XLSXFileMutations,
  XLSXFileActions
> {
  setFilename(filename: string) {
    this.commit('setFilename', filename);
  }

  setWorkBook(workbook: XLSX.WorkBook) {
    this.commit('setWorkbook', workbook);
  }

  setHeaderRow(headerRow: number) {
    this.commit('setHeaderRow', headerRow);
  }

  setCurrentPage(currentPage: number) {
    this.commit('setCurrentPage', currentPage);
  }

  setSheet(sheetname: string) {
    this.commit('setSheet', sheetname);
  }
}

function getSheetRow(num: number, sheet: XLSX.Sheet, range: XLSX.Range) {
  const row: (XLSX.CellObject | undefined)[] = [];
  if (num <= range.e.r) {
    for (let i = 0; i < range.e.c; i++) {
      row.push(sheet[XLSX.utils.encode_cell({ r: num, c: i })]);
    }
  }
  return row;
}
export const xlsxFileModule = new Module({
  state: XLSXFileState,
  getters: XLSXFileGetters,
  mutations: XLSXFileMutations,
  actions: XLSXFileActions
});
