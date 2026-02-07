export interface CSVRow {
  [key: string]: string | number | null;
}

export interface ProcessedData {
  original: CSVRow[];
  anonymized: CSVRow[];
  headers: string[];
  columnTypes: ColumnTypeMap;
}

export interface ColumnTypeMap {
  [columnName: string]: ColumnType;
}

export type ColumnType = 
  | 'name'
  | 'email' 
  | 'phone'
  | 'date'
  | 'numeric'
  | 'categorical'
  | 'unknown';

export interface AnonymizationConfig {
  [columnName: string]: {
    type: ColumnType;
    method: 'faker' | 'range' | 'shuffle' | 'generalize';
  };
}