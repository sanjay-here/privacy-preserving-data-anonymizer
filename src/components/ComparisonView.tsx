import React from 'react';
import { CSVRow } from '../types';

interface ComparisonViewProps {
  originalData: CSVRow[];
  anonymizedData: CSVRow[];
  headers: string[];
}

const PREVIEW_ROWS = 5;

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  originalData,
  anonymizedData,
  headers
}) => {
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  const previewOriginal = originalData.slice(0, PREVIEW_ROWS);
  const previewAnonymized = anonymizedData.slice(0, PREVIEW_ROWS);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Original Data */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-red-50 border-b border-red-200">
          <h3 className="text-lg font-semibold text-red-800">Original Data</h3>
          <p className="text-sm text-red-600">First {PREVIEW_ROWS} rows (sensitive)</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {previewOriginal.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {headers.map((header) => (
                    <td
                      key={header}
                      className="px-4 py-3 whitespace-nowrap text-sm text-gray-900"
                    >
                      {formatValue(row[header])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Anonymized Data */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-green-50 border-b border-green-200">
          <h3 className="text-lg font-semibold text-green-800">Anonymized Data</h3>
          <p className="text-sm text-green-600">First {PREVIEW_ROWS} rows (privacy-safe)</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {previewAnonymized.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {headers.map((header) => (
                    <td
                      key={header}
                      className="px-4 py-3 whitespace-nowrap text-sm text-gray-900"
                    >
                      {formatValue(row[header])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};