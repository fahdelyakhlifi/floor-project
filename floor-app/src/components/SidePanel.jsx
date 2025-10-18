"use client"

import { Upload, FileJson, ImageIcon } from "lucide-react"

export const SidePanel = ({ colorStops, onExportPNG, onExportJSON, onImportJSON }) => {
  const handleFileInput = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      onImportJSON(file)
    }
    e.target.value = ""
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-sm font-semibold text-gray-800">Color Legend</h3>
        </div>
        <div className="p-5 space-y-3 max-h-64 overflow-y-auto">
          {colorStops.map((stop, index) => (
            <div key={stop.id} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg shadow-md border border-gray-200"
                style={{ backgroundColor: stop.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700">Color {index + 1}</p>
                <p className="text-xs font-mono text-gray-500 truncate">{stop.color}</p>
              </div>
              <div className="text-xs font-medium text-gray-600">{stop.percentage.toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-sm font-semibold text-gray-800">Export</h3>
        </div>
        <div className="p-5 space-y-3">
          <button
            onClick={onExportPNG}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            <ImageIcon className="w-4 h-4" />
            Export as PNG
          </button>

          <button
            onClick={onExportJSON}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all shadow-md hover:shadow-lg"
          >
            <FileJson className="w-4 h-4" />
            Export as JSON
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-sm font-semibold text-gray-800">Import</h3>
        </div>
        <div className="p-5">
          <label className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg cursor-pointer">
            <Upload className="w-4 h-4" />
            Import JSON
            <input type="file" accept=".json" onChange={handleFileInput} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  )
}
