import { faker } from '@faker-js/faker';
import { CSVRow, ColumnType, ColumnTypeMap } from '../types';

export class DataAnonymizer {
  private nameMap: Map<string, string> = new Map();
  private emailMap: Map<string, string> = new Map();
  private phoneMap: Map<string, string> = new Map();
  private shuffleCache: Map<string, any[]> = new Map();

  anonymizeData(data: CSVRow[], columnTypes: ColumnTypeMap): CSVRow[] {
    // Reset maps for consistency
    this.nameMap.clear();
    this.emailMap.clear();
    this.phoneMap.clear();
    this.shuffleCache.clear();

    return data.map(row => {
      const anonymizedRow: CSVRow = {};
      
      Object.keys(row).forEach(column => {
        const value = row[column];
        const columnType = columnTypes[column];
        
        if (value === null || value === undefined || value === '') {
          anonymizedRow[column] = value;
          return;
        }

        anonymizedRow[column] = this.anonymizeValue(String(value), columnType, column, data);
      });

      return anonymizedRow;
    });
  }

  private anonymizeValue(value: string, type: ColumnType, column: string, allData: CSVRow[]): string {
    switch (type) {
      case 'name':
        return this.anonymizeName(value);
      
      case 'email':
        return this.anonymizeEmail(value);
      
      case 'phone':
        return this.anonymizePhone(value);
      
      case 'date':
        return this.anonymizeDate(value);
      
      case 'numeric':
        return this.anonymizeNumeric(value, column, allData);
      
      case 'categorical':
        return this.shuffleValue(value, column, allData);
      
      default:
        return this.shuffleValue(value, column, allData);
    }
  }

  private anonymizeName(value: string): string {
    if (this.nameMap.has(value)) {
      return this.nameMap.get(value)!;
    }

    const parts = value.trim().split(/\s+/);
    let anonymized: string;

    if (parts.length >= 2) {
      anonymized = `${faker.person.firstName()} ${faker.person.lastName()}`;
    } else {
      anonymized = faker.person.firstName();
    }

    this.nameMap.set(value, anonymized);
    return anonymized;
  }

  private anonymizeEmail(value: string): string {
    if (this.emailMap.has(value)) {
      return this.emailMap.get(value)!;
    }

    const anonymized = faker.internet.email();
    this.emailMap.set(value, anonymized);
    return anonymized;
  }

  private anonymizePhone(value: string): string {
    if (this.phoneMap.has(value)) {
      return this.phoneMap.get(value)!;
    }

    // Generate a consistent format phone number
    const anonymized = faker.phone.number('###-###-####');
    this.phoneMap.set(value, anonymized);
    return anonymized;
  }

  private anonymizeDate(value: string): string {
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) return value;
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      return `${monthNames[date.getMonth()]}-${date.getFullYear()}`;
    } catch {
      return value;
    }
  }

  private anonymizeNumeric(value: string, column: string, allData: CSVRow[]): string {
    const num = parseFloat(value);
    if (isNaN(num)) return value;

    // Get all numeric values in this column to determine if we should use ranges or shuffle
    const allValues = allData.map(row => {
      const val = row[column];
      return val !== null && val !== undefined && val !== '' ? parseFloat(String(val)) : null;
    }).filter(v => v !== null && !isNaN(v as number)) as number[];
    
    const uniqueValues = new Set(allValues);
    
    // If too many unique values (more than 50% unique), shuffle instead of range
    if (uniqueValues.size > allValues.length * 0.5) {
      return this.shuffleValue(value, column, allData);
    }

    // Create age-like ranges (for values 0-120, likely ages)
    if (num >= 0 && num <= 120) {
      // Create age ranges: 0-5, 6-12, 13-18, 19-25, 26-35, 36-45, 46-55, 56-65, 66-75, 76+
      if (num <= 5) return "0-5";
      if (num <= 12) return "6-12";
      if (num <= 18) return "13-18";
      if (num <= 25) return "19-25";
      if (num <= 35) return "26-35";
      if (num <= 45) return "36-45";
      if (num <= 55) return "46-55";
      if (num <= 65) return "56-65";
      if (num <= 75) return "66-75";
      return "76+";
    }

    // For salary-like values (large numbers), create broader ranges
    if (num >= 1000) {
      const rangeSize = Math.pow(10, Math.floor(Math.log10(num)) - 1);
      const lowerBound = Math.floor(num / rangeSize) * rangeSize;
      const upperBound = lowerBound + rangeSize - 1;
      return `${lowerBound}-${upperBound}`;
    }

    // For other values, create small ranges
    const rangeSize = Math.max(1, Math.floor(num * 0.1));
    return `${num - rangeSize}-${num + rangeSize}`;
  }

  private shuffleValue(value: string, column: string, allData: CSVRow[]): string {
    if (!this.shuffleCache.has(column)) {
      // Get all non-null values for this column
      const allValues = allData.map(row => row[column])
        .filter(v => v !== null && v !== undefined && v !== '');
      
      // Shuffle the values
      const shuffled = this.shuffleArray([...allValues]);
      this.shuffleCache.set(column, shuffled);
    }
    
    const shuffledValues = this.shuffleCache.get(column)!;
    const originalValues = allData.map(row => row[column])
      .filter(v => v !== null && v !== undefined && v !== '');
    
    const originalIndex = originalValues.indexOf(value);
    return shuffledValues[originalIndex % shuffledValues.length];
  }

  shuffleColumns(data: CSVRow[], columnsToShuffle: string[]): CSVRow[] {
    const result = data.map(row => ({ ...row }));
    
    columnsToShuffle.forEach(column => {
      const values = data.map(row => row[column]).filter(v => v !== null && v !== undefined && v !== '');
      const shuffledValues = this.shuffleArray([...values]);
      
      let shuffleIndex = 0;
      result.forEach(row => {
        if (row[column] !== null && row[column] !== undefined && row[column] !== '') {
          row[column] = shuffledValues[shuffleIndex % shuffledValues.length];
          shuffleIndex++;
        }
      });
    });

    return result;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}