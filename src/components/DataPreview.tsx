import React, { useState } from 'react';
import { ColumnType, CSVRow } from '../types';
import { Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';

interface DataPreviewProps {
  originalData: CSVRow[];
  anonymizedData: CSVRow[];
  headers: string[];
  columnTypes: { [key: string]: ColumnType };
}

const ROWS_PER_PAGE = 10;

const getColumnTypeColor = (type: ColumnType): string => {
  const colors = {
    name: 'bg-blue-100 text-blue-800',
    email: 'bg-green-100 text-green-800',
    phone: 'bg-purple-100 text-purple-800',
    date: 'bg-yellow-100 text-yellow-800',
    numeric: 'bg-red-100 text-red-800',
    categorical: 'bg-indigo-100 text-indigo-800',
    unknown: 'bg-gray-100 text-gray-800',
  };
  return colors[type] || colors.unknown;
};

export const DataPreview: React.FC<DataPreviewProps> = ({
  originalData,
  anonymizedData,
  headers,
  columnTypes
}) => {
  const [showAnonymized, setShowAnonymized] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const data = showAnonymized ? anonymizedData : originalData;
  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const startIndex = currentPage * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const currentData = data.slice(startIndex, endIndex);

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Data Preview ({data.length} rows)
          </h3>
          
          <button
            onClick={() => setShowAnonymized(!showAnonymized)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              showAnonymized
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            {showAnonymized ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span>Show Original</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span>Show Anonymized</span>
              </>
            )}
          </button>
        </div>

        {/* Column Type Legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(columnTypes).map(([column, type]) => (
            <span
              key={column}
              className={`px-2 py-1 rounded-full text-xs font-medium ${getColumnTypeColor(type)}`}
            >
              {column} ({type})
            </span>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((row, index) => (
              <tr key={startIndex + index} className="hover:bg-gray-50">
                {headers.map((header) => (
                  <td
                    key={header}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {formatValue(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} results
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            
            <span className="px-3 py-2 text-sm font-medium text-gray-700">
              Page {currentPage + 1} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};