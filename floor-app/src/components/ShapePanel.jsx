const ShapePanel = ({ shapeType, width, height, onShapeTypeChange, onWidthChange, onHeightChange }) => {
  const shapes = [
    { type: 'rectangle', label: 'Rectangle' },
    { type: 'circle', label: 'Circle' },
    { type: 'triangle', label: 'Triangle' },
    { type: 'star', label: 'Star' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Shape Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          {shapes.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => onShapeTypeChange(type)}
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all
                ${
                  shapeType === type
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }
              `}
            >
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Shape Size (px)
        </label>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">Width</span>
              <span className="text-xs font-medium text-gray-900">{width}px</span>
            </div>
            <div className="flex gap-2">
              <input
                type="range"
                min="10"
                max="200"
                value={width}
                onChange={(e) => onWidthChange(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <input
                type="number"
                min="10"
                max="200"
                value={width}
                onChange={(e) => onWidthChange(Number(e.target.value))}
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">Height</span>
              <span className="text-xs font-medium text-gray-900">{height}px</span>
            </div>
            <div className="flex gap-2">
              <input
                type="range"
                min="10"
                max="200"
                value={height}
                onChange={(e) => onHeightChange(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <input
                type="number"
                min="10"
                max="200"
                value={height}
                onChange={(e) => onHeightChange(Number(e.target.value))}
                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Preview</span>
            </div>
            <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
              <div
                className="flex items-center justify-center bg-blue-500 text-white text-xs font-medium"
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  borderRadius: shapeType === 'circle' ? '50%' : '0%',
                  clipPath: shapeType === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 
                           shapeType === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' : 'none'
                }}
              >
                {width}×{height}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};