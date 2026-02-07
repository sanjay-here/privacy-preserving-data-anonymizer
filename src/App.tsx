import React, { useState } from 'react';
import { Shield, Download, RotateCcw, AlertCircle, Heart } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { DataPreview } from './components/DataPreview';
import { ComparisonView } from './components/ComparisonView';
import { StatsPanel } from './components/StatsPanel';
import { CSVProcessor } from './utils/csvProcessor';
import { ProcessedData } from './types';

function App() {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const csvProcessor = new CSVProcessor();

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setFileName(file.name);

    try {
      const result = await csvProcessor.processFile(file);
      setProcessedData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (processedData) {
      const timestamp = new Date().toISOString().split('T')[0];
      const downloadFileName = fileName.replace('.csv', `_anonymized_${timestamp}.csv`);
      csvProcessor.exportToCSV(processedData.anonymized, downloadFileName);
    }
  };

  const handleReset = () => {
    setProcessedData(null);
    setFileName('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Privacy-Preserving Data Anonymizer
                </h1>
                <p className="text-sm text-gray-600">
                  Securely anonymize sensitive data in CSV files
                </p>
              </div>
            </div>
            
            {processedData && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Anonymized CSV</span>
                </button>
                
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Process New File</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!processedData ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Upload Your CSV File
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our intelligent system will automatically detect data types and apply appropriate anonymization methods to protect privacy while preserving data utility.
              </p>
            </div>
            
            <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
            
            {/* Features List */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Detection</h3>
                <p className="text-sm text-gray-600">
                  Automatically identifies names, emails, phones, dates, and other sensitive data types
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <RotateCcw className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Multiple Methods</h3>
                <p className="text-sm text-gray-600">
                  Uses faker data, ranges, shuffling, and generalization based on data type
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Download className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Easy Export</h3>
                <p className="text-sm text-gray-600">
                  Preview results and download anonymized data as a clean CSV file
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats and Quick Actions */}
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <StatsPanel
                  totalRows={processedData.original.length}
                  totalColumns={processedData.headers.length}
                  columnTypes={processedData.columnTypes}
                  fileName={fileName}
                />
              </div>
              
              <div className="lg:col-span-3">
                <ComparisonView
                  originalData={processedData.original}
                  anonymizedData={processedData.anonymized}
                  headers={processedData.headers}
                />
              </div>
            </div>

            {/* Full Data Preview */}
            <DataPreview
              originalData={processedData.original}
              anonymizedData={processedData.anonymized}
              headers={processedData.headers}
              columnTypes={processedData.columnTypes}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <span className="text-sm">Developed by Sanjay A</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
