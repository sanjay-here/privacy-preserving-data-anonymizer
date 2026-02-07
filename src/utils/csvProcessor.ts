import Papa from 'papaparse';
import { CSVRow, ProcessedData, ColumnTypeMap } from '../types';
import { ColumnDetector } from './columnDetector';
import { DataAnonymizer } from './anonymizer';

export class CSVProcessor {
  private anonymizer = new DataAnonymizer();

  async processFile(file: File): Promise<ProcessedData> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          try {
            const data = results.data as CSVRow[];
            const headers = Object.keys(data[0] || {});
            
            // Detect column types
            const columnTypes: ColumnTypeMap = {};
            headers.forEach(header => {
              const values = data.map(row => row[header]);
              columnTypes[header] = ColumnDetector.detectColumnType(header, values);
            });

            // Anonymize data
            const anonymizedData = this.anonymizeData(data, columnTypes);

            resolve({
              original: data,
              anonymized: anonymizedData,
              headers,
              columnTypes
            });
          } catch (error) {
            reject(new Error(`Failed to process CSV: ${error}`));
          }
        },
        error: (error) => {
          reject(new Error(`Failed to parse CSV: ${error.message}`));
        }
      });
    });
  }

  private anonymizeData(data: CSVRow[], columnTypes: ColumnTypeMap): CSVRow[] {
    // Apply anonymization - each method handles its own logic including shuffling
    return this.anonymizer.anonymizeData(data, columnTypes);
  }

  exportToCSV(data: CSVRow[], filename: string): void {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}