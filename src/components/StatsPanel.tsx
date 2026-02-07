import React from 'react';
import { ColumnType, ColumnTypeMap } from '../types';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Hash, 
  Tag, 
  HelpCircle,
  BarChart3,
  Shield,
  FileText
} from 'lucide-react';

interface StatsPanelProps {
  totalRows: number;
  totalColumns: number;
  columnTypes: ColumnTypeMap;
  fileName: string;
}

const getTypeIcon = (type: ColumnType) => {
  const iconProps = { className: "h-5 w-5" };
  
  switch (type) {
    case 'name': return <User {...iconProps} />;
    case 'email': return <Mail {...iconProps} />;
    case 'phone': return <Phone {...iconProps} />;
    case 'date': return <Calendar {...iconProps} />;
    case 'numeric': return <Hash {...iconProps} />;
    case 'categorical': return <Tag {...iconProps} />;
    default: return <HelpCircle {...iconProps} />;
  }
};

const getTypeColor = (type: ColumnType): string => {
  const colors = {
    name: 'text-blue-600 bg-blue-50 border-blue-200',
    email: 'text-green-600 bg-green-50 border-green-200',
    phone: 'text-purple-600 bg-purple-50 border-purple-200',
    date: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    numeric: 'text-red-600 bg-red-50 border-red-200',
    categorical: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    unknown: 'text-gray-600 bg-gray-50 border-gray-200',
  };
  return colors[type] || colors.unknown;
};

export const StatsPanel: React.FC<StatsPanelProps> = ({
  totalRows,
  totalColumns,
  columnTypes,
  fileName
}) => {
  const typeStats = Object.values(columnTypes).reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<ColumnType, number>);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <BarChart3 className="h-5 w-5 mr-2" />
        Dataset Statistics
      </h3>

      <div className="space-y-4">
        {/* File Info */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <FileText className="h-5 w-5 text-gray-600" />
          <div>
            <p className="text-sm font-medium text-gray-800">File</p>
            <p className="text-xs text-gray-600 truncate max-w-48">{fileName}</p>
          </div>
        </div>

        {/* Basic Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-2xl font-bold text-blue-600">{totalRows}</p>
            <p className="text-sm text-blue-700">Rows</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-2xl font-bold text-green-600">{totalColumns}</p>
            <p className="text-sm text-green-700">Columns</p>
          </div>
        </div>

        {/* Column Types */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Shield className="h-4 w-4 mr-1" />
            Anonymization Methods
          </h4>
          <div className="space-y-2">
            {Object.entries(typeStats).map(([type, count]) => (
              <div
                key={type}
                className={`flex items-center justify-between p-2 rounded-lg border ${getTypeColor(type as ColumnType)}`}
              >
                <div className="flex items-center space-x-2">
                  {getTypeIcon(type as ColumnType)}
                  <span className="text-sm font-medium capitalize">{type}</span>
                </div>
                <span className="text-sm font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Anonymization Summary */}
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <h4 className="text-sm font-medium text-green-800 mb-1">Privacy Protection</h4>
          <p className="text-xs text-green-700">
            All {totalColumns} columns have been anonymized using appropriate methods for their data types.
          </p>
        </div>
      </div>
    </div>
  );
};