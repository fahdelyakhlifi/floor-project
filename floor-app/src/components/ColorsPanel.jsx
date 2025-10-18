import { Plus, Trash2, Palette } from 'lucide-react';

export const ColorsPanel = ({
  background,
  colorStops,
  useGradient,
  onBackgroundChange,
  onColorStopsChange,
  onUseGradientChange,
}) => {
  const addColorStop = () => {
    const newStop = {
      id: `color-${Date.now()}`,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      percentage: 100 / (colorStops.length + 1),
    };
    onColorStopsChange([...colorStops, newStop]);
  };

  const removeColorStop = (id) => {
    if (colorStops.length > 1) {
      onColorStopsChange(colorStops.filter((stop) => stop.id !== id));
    }
  };

  const updateColorStop = (id, updates) => {
    onColorStopsChange(
      colorStops.map((stop) =>
        stop.id === id ? { ...stop, ...updates } : stop
      )
    );
  };

  const normalizePercentages = () => {
    const total = colorStops.reduce((sum, stop) => sum + stop.percentage, 0);
    if (total > 0) {
      onColorStopsChange(
        colorStops.map((stop) => ({
          ...stop,
          percentage: (stop.percentage / total) * 100,
        }))
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Background Color
        </label>
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-gray-200">
          <div className="relative">
            <input
              type="color"
              value={background}
              onChange={(e) => onBackgroundChange(e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer border border-gray-300"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={background}
              onChange={(e) => onBackgroundChange(e.target.value)}
              className="w-full px-3 py-2 text-sm font-mono bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Shape Colors
          </label>
          <button
            onClick={addColorStop}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Color
          </button>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {colorStops.map((stop) => (
            <div
              key={stop.id}
              className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors group"
            >
              <div className="relative flex-shrink-0">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) =>
                    updateColorStop(stop.id, { color: e.target.value })
                  }
                  className="w-10 h-10 rounded-lg cursor-pointer border border-gray-300"
                />
              </div>

              <div className="flex-1 space-y-2 min-w-0">
                <input
                  type="text"
                  value={stop.color}
                  onChange={(e) =>
                    updateColorStop(stop.id, { color: e.target.value })
                  }
                  className="w-full px-2 py-1 text-xs font-mono bg-gray-50 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#FFFFFF"
                />

                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={stop.percentage}
                    onChange={(e) =>
                      updateColorStop(stop.id, {
                        percentage: Number(e.target.value),
                      })
                    }
                    onMouseUp={normalizePercentages}
                    onTouchEnd={normalizePercentages}
                    className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 slider-thumb"
                  />
                  <span className="text-xs font-medium text-gray-600 w-10 text-right">
                    {stop.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>

              {colorStops.length > 1 && (
                <button
                  onClick={() => removeColorStop(stop.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 border border-red-200 hover:border-red-300"
                  title="Delete color"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
          <input
            type="checkbox"
            checked={useGradient}
            onChange={(e) => onUseGradientChange(e.target.checked)}
            className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 border-gray-300"
          />
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Use Gradient
            </span>
          </div>
        </label>
      </div>
    </div>
  );
};