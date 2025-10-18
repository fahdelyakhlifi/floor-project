import { Grid3x3, Waves, Shuffle, Sparkles } from "lucide-react"

export const PatternPanel = ({
  density,
  minSize,
  maxSize,
  opacity,
  seed,
  edgeSoftness,
  finish,
  designType,
  onDensityChange,
  onMinSizeChange,
  onMaxSizeChange,
  onOpacityChange,
  onSeedChange,
  onEdgeSoftnessChange,
  onFinishChange,
  onDesignTypeChange,
}) => {
  const designTypes = [
    { type: "random", icon: Shuffle, label: "Random" },
    { type: "wavy", icon: Waves, label: "Wavy" },
    { type: "grid", icon: Grid3x3, label: "Grid" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Design Type</label>
        <div className="grid grid-cols-3 gap-2">
          {designTypes.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => onDesignTypeChange(type)}
              className={`
                flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all
                ${
                  designType === type
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }
              `}
            >
              <Icon className="w-5 h-5 mb-1.5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Density</span>
          <span className="text-xs font-medium text-gray-900">{density}</span>
        </div>
        <input
          type="range"
          min="10"
          max="500"
          value={density}
          onChange={(e) => onDensityChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Min Size</span>
            <span className="text-xs font-medium text-gray-900">{minSize}px</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            value={minSize}
            onChange={(e) => onMinSizeChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Max Size</span>
            <span className="text-xs font-medium text-gray-900">{maxSize}px</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={maxSize}
            onChange={(e) => onMaxSizeChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Opacity</span>
          <span className="text-xs font-medium text-gray-900">{opacity}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={opacity}
          onChange={(e) => onOpacityChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Edge Softness</span>
          <span className="text-xs font-medium text-gray-900">{edgeSoftness}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={edgeSoftness}
          onChange={(e) => onEdgeSoftnessChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Finish</label>
        <div className="flex gap-2">
          <button
            onClick={() => onFinishChange("glossy")}
            className={`
              flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all
              ${
                finish === "glossy" ? "bg-blue-500 text-white shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }
            `}
          >
            <Sparkles className="w-4 h-4 inline mr-1.5" />
            Glossy
          </button>
          <button
            onClick={() => onFinishChange("matte")}
            className={`
              flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all
              ${finish === "matte" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
            `}
          >
            Matte
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Random Seed</span>
          <button
            onClick={() => onSeedChange(Math.floor(Math.random() * 10000))}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Randomize
          </button>
        </div>
        <input
          type="number"
          value={seed}
          onChange={(e) => onSeedChange(Number(e.target.value))}
          className="w-full px-3 py-2 text-sm bg-white rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}