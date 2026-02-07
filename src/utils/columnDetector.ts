import { CSVRow, ColumnType } from '../types';

export class ColumnDetector {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$|^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$|^\d{10}$|^\d{3}[-.\s]\d{3}[-.\s]\d{4}$/;
  private static readonly DATE_REGEX = /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$|^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/;
  private static readonly NAME_INDICATORS = ['name', 'first', 'last', 'fname', 'lname', 'fullname'];
  private static readonly EMAIL_INDICATORS = ['email', 'mail', 'e_mail'];
  private static readonly PHONE_INDICATORS = ['phone', 'mobile', 'tel', 'telephone', 'contact'];
  private static readonly DATE_INDICATORS = ['date', 'birth', 'created', 'updated', 'time'];

  static detectColumnType(columnName: string, values: (string | number | null)[]): ColumnType {
    const cleanName = columnName.toLowerCase().trim();
    const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
    
    if (nonNullValues.length === 0) return 'unknown';

    // Check column name patterns first
    if (this.NAME_INDICATORS.some(indicator => cleanName.includes(indicator))) {
      return 'name';
    }
    
    if (this.EMAIL_INDICATORS.some(indicator => cleanName.includes(indicator))) {
      return 'email';
    }
    
    if (this.PHONE_INDICATORS.some(indicator => cleanName.includes(indicator))) {
      return 'phone';
    }
    
    if (this.DATE_INDICATORS.some(indicator => cleanName.includes(indicator))) {
      return 'date';
    }

    // Check value patterns
    const stringValues = nonNullValues.map(v => String(v));
    
    // Email detection
    const emailMatches = stringValues.filter(v => this.EMAIL_REGEX.test(v));
    if (emailMatches.length > nonNullValues.length * 0.7) {
      return 'email';
    }
    
    // Phone detection
    const phoneMatches = stringValues.filter(v => this.PHONE_REGEX.test(v.replace(/\s/g, '')));
    if (phoneMatches.length > nonNullValues.length * 0.7) {
      return 'phone';
    }
    
    // Date detection
    const dateMatches = stringValues.filter(v => {
      if (this.DATE_REGEX.test(v)) return true;
      const parsed = Date.parse(v);
      return !isNaN(parsed) && parsed > 0;
    });
    if (dateMatches.length > nonNullValues.length * 0.6) {
      return 'date';
    }
    
    // Numeric detection
    const numericValues = nonNullValues.filter(v => !isNaN(Number(v)));
    if (numericValues.length > nonNullValues.length * 0.9) {
      return 'numeric';
    }
    
    // Categorical detection (limited unique values)
    const uniqueValues = new Set(stringValues);
    if (uniqueValues.size <= Math.max(10, nonNullValues.length * 0.5) && uniqueValues.size > 1) {
      return 'categorical';
    }
    
    // Name detection based on patterns (common names, proper case)
    if (this.looksLikeName(stringValues)) {
      return 'name';
    }
    
    return 'categorical'; // Default to categorical for safer shuffling
  }

  private static looksLikeName(values: string[]): boolean {
    const namePatterns = [
      /^[A-Z][a-z]+ [A-Z][a-z]+$/, // First Last
      /^[A-Z][a-z]+$/, // Single name
      /^[A-Z][a-z]+[,] [A-Z][a-z]+$/ // Last, First
    ];
    
    const matchingValues = values.filter(v => 
      namePatterns.some(pattern => pattern.test(v.trim()))
    );
    
    return matchingValues.length > values.length * 0.6;
  }
}