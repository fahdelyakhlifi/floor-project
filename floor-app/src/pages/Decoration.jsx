"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"

// ==================== Shape Panel ====================
const ShapePanel = ({ shapeType, width, height, onShapeTypeChange, onWidthChange, onHeightChange }) => {
  const shapes = [
    { type: "rectangle", label: "Rectangle" },
    { type: "circle", label: "Circle" },
    { type: "triangle", label: "Triangle" },
    { type: "star", label: "Star" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Shape Type</label>
        <div className="grid grid-cols-2 gap-3">
          {shapes.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => onShapeTypeChange(type)}
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all
                ${
                  shapeType === type
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                    : "border-slate-600 bg-slate-700/50 text-slate-400 hover:border-slate-500"
                }
              `}
            >
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Shape Size (px)</label>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Width</span>
              <span className="text-xs font-medium text-cyan-400">{width}px</span>
            </div>
            <div className="flex gap-2">
              <input
                type="range"
                min="10"
                max="200"
                value={width}
                onChange={(e) => onWidthChange(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <input
                type="number"
                min="10"
                max="200"
                value={width}
                onChange={(e) => onWidthChange(Number(e.target.value))}
                className="w-20 px-2 py-1 text-sm border border-slate-600 rounded bg-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">Height</span>
              <span className="text-xs font-medium text-cyan-400">{height}px</span>
            </div>
            <div className="flex gap-2">
              <input
                type="range"
                min="10"
                max="200"
                value={height}
                onChange={(e) => onHeightChange(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <input
                type="number"
                min="10"
                max="200"
                value={height}
                onChange={(e) => onHeightChange(Number(e.target.value))}
                className="w-20 px-2 py-1 text-sm border border-slate-600 rounded bg-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== Colors Panel ====================
const ColorsPanel = ({
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
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      percentage: 100 / (colorStops.length + 1),
    }
    onColorStopsChange([...colorStops, newStop])
  }

  const removeColorStop = (id) => {
    if (colorStops.length > 1) {
      onColorStopsChange(colorStops.filter((stop) => stop.id !== id))
    }
  }

  const updateColorStop = (id, updates) => {
    onColorStopsChange(colorStops.map((stop) => (stop.id === id ? { ...stop, ...updates } : stop)))
  }

  const normalizePercentages = () => {
    const total = colorStops.reduce((sum, stop) => sum + stop.percentage, 0)
    if (total > 0) {
      onColorStopsChange(
        colorStops.map((stop) => ({
          ...stop,
          percentage: (stop.percentage / total) * 100,
        })),
      )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Background Color</label>
        <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl border border-slate-600">
          <div className="relative">
            <input
              type="color"
              value={background}
              onChange={(e) => onBackgroundChange(e.target.value)}
              className="w-12 h-12 rounded-lg cursor-pointer border border-slate-500"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={background}
              onChange={(e) => onBackgroundChange(e.target.value)}
              className="w-full px-3 py-2 text-sm font-mono bg-slate-600/50 rounded-lg border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-slate-300">Shape Colors</label>
          <button
            onClick={addColorStop}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-lg hover:bg-cyan-500/20 transition-colors border border-cyan-500/30"
          >
            <span className="text-lg">+</span>
            Add Color
          </button>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {colorStops.map((stop) => (
            <div
              key={stop.id}
              className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl border border-slate-600 hover:border-slate-500 transition-colors group"
            >
              <div className="relative flex-shrink-0">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateColorStop(stop.id, { color: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-slate-500"
                />
              </div>

              <div className="flex-1 space-y-2 min-w-0">
                <input
                  type="text"
                  value={stop.color}
                  onChange={(e) => updateColorStop(stop.id, { color: e.target.value })}
                  className="w-full px-2 py-1 text-xs font-mono bg-slate-600/50 rounded border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                    className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 slider-thumb"
                  />
                  <span className="text-xs font-medium text-slate-400 w-10 text-right">
                    {stop.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>

              {colorStops.length > 1 && (
                <button
                  onClick={() => removeColorStop(stop.id)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0 border border-red-500/30 hover:border-red-500/50"
                  title="Delete color"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 p-4 bg-slate-700/50 rounded-xl border border-slate-600 cursor-pointer hover:border-slate-500 transition-colors">
          <input
            type="checkbox"
            checked={useGradient}
            onChange={(e) => onUseGradientChange(e.target.checked)}
            className="w-5 h-5 text-cyan-500 rounded focus:ring-2 focus:ring-cyan-500 bg-slate-600 border-slate-500"
          />
          <div className="flex items-center gap-2">
            <span className="text-lg">🎨</span>
            <span className="text-sm font-medium text-slate-300">Use Gradient</span>
          </div>
        </label>
      </div>
    </div>
  )
}

// ==================== Pattern Panel ====================
const PatternPanel = ({
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
    { type: "random", label: "Random" },
    { type: "wavy", label: "Wavy" },
    { type: "grid", label: "Grid" },
  ]

  return (
    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Design Type</label>
        <div className="grid grid-cols-3 gap-2">
          {designTypes.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => onDesignTypeChange(type)}
              className={`
                flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all
                ${
                  designType === type
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                    : "border-slate-600 bg-slate-700/50 text-slate-400 hover:border-slate-500"
                }
              `}
            >
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">Density</span>
          <span className="text-sm font-medium text-cyan-400">{density}</span>
        </div>
        <input
          type="range"
          min="10"
          max="500"
          value={density}
          onChange={(e) => onDensityChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Min Size</span>
            <span className="text-xs font-medium text-cyan-400">{minSize}px</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            value={minSize}
            onChange={(e) => onMinSizeChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Max Size</span>
            <span className="text-xs font-medium text-cyan-400">{maxSize}px</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={maxSize}
            onChange={(e) => onMaxSizeChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">Opacity</span>
          <span className="text-sm font-medium text-cyan-400">{opacity}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={opacity}
          onChange={(e) => onOpacityChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">Edge Softness</span>
          <span className="text-sm font-medium text-cyan-400">{edgeSoftness}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={edgeSoftness}
          onChange={(e) => onEdgeSoftnessChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Finish</label>
        <div className="flex gap-2">
          <button
            onClick={() => onFinishChange("glossy")}
            className={`
              flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all
              ${
                finish === "glossy"
                  ? "bg-cyan-600 text-white shadow-lg"
                  : "bg-slate-700/50 text-slate-400 hover:bg-slate-700"
              }
            `}
          >
            ✨ Glossy
          </button>
          <button
            onClick={() => onFinishChange("matte")}
            className={`
              flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all
              ${finish === "matte" ? "bg-cyan-600 text-white" : "bg-slate-700/50 text-slate-400 hover:bg-slate-700"}
            `}
          >
            Matte
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">Random Seed</span>
          <button
            onClick={() => onSeedChange(Math.floor(Math.random() * 10000))}
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
          >
            Randomize
          </button>
        </div>
        <input
          type="number"
          value={seed}
          onChange={(e) => onSeedChange(Number(e.target.value))}
          className="w-full px-3 py-2 text-sm bg-slate-700/50 rounded-lg border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>
    </div>
  )
}

// ==================== Design Canvas ====================
const DesignCanvas = ({ config, positions, onCanvasReady }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    ctx.scale(dpr, dpr)

    ctx.fillStyle = config.colors.background
    ctx.fillRect(0, 0, rect.width, rect.height)

    const getColorForIndex = (index) => {
      if (config.colors.stops.length === 0) return "#000000"

      if (config.colors.useGradient) {
        const totalPercentage = config.colors.stops.reduce((sum, stop) => sum + stop.percentage, 0)
        let cumulative = 0
        const normalizedIndex = (index / positions.length) * 100

        for (let i = 0; i < config.colors.stops.length; i++) {
          const stop = config.colors.stops[i]
          const normalizedPercentage = (stop.percentage / totalPercentage) * 100
          cumulative += normalizedPercentage

          if (normalizedIndex <= cumulative || i === config.colors.stops.length - 1) {
            if (i === 0) return stop.color

            const prevStop = config.colors.stops[i - 1]
            const prevCumulative = cumulative - normalizedPercentage
            const t = (normalizedIndex - prevCumulative) / normalizedPercentage

            const prevColor = hexToRgb(prevStop.color)
            const currColor = hexToRgb(stop.color)

            const r = Math.round(prevColor.r + (currColor.r - prevColor.r) * t)
            const g = Math.round(prevColor.g + (currColor.g - prevColor.g) * t)
            const b = Math.round(prevColor.b + (currColor.b - prevColor.b) * t)

            return `rgb(${r}, ${g}, ${b})`
          }
        }
      }

      return config.colors.stops[index % config.colors.stops.length].color
    }

    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? {
            r: Number.parseInt(result[1], 16),
            g: Number.parseInt(result[2], 16),
            b: Number.parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 }
    }

    const drawShape = (x, y, size, rotation, color) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((rotation * Math.PI) / 180)

      ctx.globalAlpha = config.pattern.opacity / 100

      // Utiliser les dimensions de la forme avec ajustement de taille
      const shapeWidth = config.shape.width
      const shapeHeight = config.shape.height
      
      // Calculer l'échelle basée sur la taille de la position
      const scale = size / Math.max(shapeWidth, shapeHeight)
      const scaledWidth = shapeWidth * scale
      const scaledHeight = shapeHeight * scale

      if (config.pattern.finish === "glossy") {
        const maxSize = Math.max(scaledWidth, scaledHeight)
        const gradient = ctx.createRadialGradient(0, -maxSize / 4, 0, 0, 0, maxSize)
        const rgb = hexToRgb(color)
        gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`)
        gradient.addColorStop(0.5, color)
        gradient.addColorStop(
          1,
          `rgba(${Math.max(0, rgb.r - 40)}, ${Math.max(0, rgb.g - 40)}, ${Math.max(0, rgb.b - 40)}, 1)`,
        )
        ctx.fillStyle = gradient
      } else {
        ctx.fillStyle = color
      }

      if (config.pattern.edgeSoftness > 0) {
        const maxSize = Math.max(scaledWidth, scaledHeight)
        ctx.shadowBlur = (config.pattern.edgeSoftness / 100) * maxSize * 0.5
        ctx.shadowColor = color
      }

      ctx.beginPath()

      switch (config.shape.type) {
        case "circle":
          const circleRadius = Math.min(scaledWidth, scaledHeight) / 2
          ctx.arc(0, 0, circleRadius, 0, Math.PI * 2)
          break

        case "rectangle":
          ctx.rect(-scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight)
          break

        case "triangle":
          ctx.moveTo(0, -scaledHeight / 2)
          ctx.lineTo(-scaledWidth / 2, scaledHeight / 2)
          ctx.lineTo(scaledWidth / 2, scaledHeight / 2)
          ctx.closePath()
          break

        case "star":
          const spikes = 5
          const outerRadius = Math.min(scaledWidth, scaledHeight) / 2
          const innerRadius = outerRadius / 2
          let rot = (Math.PI / 2) * 3
          const step = Math.PI / spikes

          ctx.moveTo(0, -outerRadius)
          for (let i = 0; i < spikes; i++) {
            ctx.lineTo(Math.cos(rot) * outerRadius, Math.sin(rot) * outerRadius)
            rot += step

            ctx.lineTo(Math.cos(rot) * innerRadius, Math.sin(rot) * innerRadius)
            rot += step
          }
          ctx.closePath()
          break
      }

      ctx.fill()
      ctx.restore()
    }

    positions.forEach((pos) => {
      const color = getColorForIndex(pos.colorIndex)
      drawShape(pos.x, pos.y, pos.size, pos.rotation, color)
    })

    if (onCanvasReady) {
      onCanvasReady(canvas)
    }
  }, [config, positions, onCanvasReady])

  return (
    <canvas ref={canvasRef} className="w-full h-full rounded-2xl shadow-lg" style={{ width: "100%", height: "100%" }} />
  )
}

// ==================== Side Panel ====================
const SidePanel = ({ colorStops, onExportPNG, onExportJSON, onImportJSON }) => {
  const handleFileInput = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      onImportJSON(file)
    }
    e.target.value = ""
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-2xl shadow-lg border border-slate-700/50 overflow-hidden backdrop-blur-lg">
        <div className="px-5 py-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-700">
          <h3 className="text-sm font-semibold text-slate-200">Color Legend</h3>
        </div>
        <div className="p-5 space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
          {colorStops.map((stop, index) => (
            <div key={stop.id} className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg shadow-md border border-slate-600"
                style={{ backgroundColor: stop.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-300">Color {index + 1}</p>
                <p className="text-xs font-mono text-slate-400 truncate">{stop.color}</p>
              </div>
              <div className="text-xs font-medium text-slate-400">{stop.percentage.toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-2xl shadow-lg border border-slate-700/50 overflow-hidden backdrop-blur-lg">
        <div className="px-5 py-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-700">
          <h3 className="text-sm font-semibold text-slate-200">Export</h3>
        </div>
        <div className="p-5 space-y-3">
          <button
            onClick={onExportPNG}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-xl font-medium hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
          >
            🖼️ Export as PNG
          </button>

          <button
            onClick={onExportJSON}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-medium hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg"
          >
            📄 Export as JSON
          </button>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-2xl shadow-lg border border-slate-700/50 overflow-hidden backdrop-blur-lg">
        <div className="px-5 py-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-700">
          <h3 className="text-sm font-semibold text-slate-200">Import</h3>
        </div>
        <div className="p-5">
          <label className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-medium hover:from-emerald-500 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg cursor-pointer">
            📤 Import JSON
            <input type="file" accept=".json" onChange={handleFileInput} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  )
}

// ==================== Helper Classes ====================
class SeededRandom {
  constructor(seed) {
    this.seed = seed
  }

  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }

  range(min, max) {
    return min + this.next() * (max - min)
  }
}

const generateShapePositions = (count, seed, minSize, maxSize, width, height, designType, colorCount, shapeWidth, shapeHeight) => {
  const rng = new SeededRandom(seed)
  const positions = []

  // Calculer la taille basée sur les dimensions de la forme
  const getAdjustedSize = () => {
    const baseSize = rng.range(minSize, maxSize)
    // Adapter la taille selon les proportions de la forme
    const aspectRatio = shapeWidth / shapeHeight
    const adjustedSize = baseSize * Math.sqrt(Math.abs(aspectRatio))
    return Math.max(minSize, Math.min(maxSize, adjustedSize))
  }

  if (designType === "grid") {
    const cols = Math.ceil(Math.sqrt(count * (width / height)))
    const rows = Math.ceil(count / cols)
    const cellWidth = width / cols
    const cellHeight = height / rows

    for (let i = 0; i < count; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = col * cellWidth + cellWidth / 2 + rng.range(-cellWidth * 0.2, cellWidth * 0.2)
      const y = row * cellHeight + cellHeight / 2 + rng.range(-cellHeight * 0.2, cellHeight * 0.2)

      positions.push({
        x: Math.max(0, Math.min(width, x)),
        y: Math.max(0, Math.min(height, y)),
        size: getAdjustedSize(),
        rotation: rng.range(0, 360),
        colorIndex: Math.floor(rng.next() * colorCount),
        id: `shape-${i}`,
      })
    }
  } else if (designType === "wavy") {
    const rows = Math.ceil(Math.sqrt(count))
    const cols = Math.ceil(count / rows)
    const cellWidth = width / cols
    const cellHeight = height / rows

    for (let i = 0; i < count; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const baseX = col * cellWidth + cellWidth / 2
      const baseY = row * cellHeight + cellHeight / 2

      const waveOffset = Math.sin(row * 0.5) * cellWidth * 0.3
      const x = baseX + waveOffset + rng.range(-cellWidth * 0.15, cellWidth * 0.15)
      const y = baseY + rng.range(-cellHeight * 0.15, cellHeight * 0.15)

      positions.push({
        x: Math.max(0, Math.min(width, x)),
        y: Math.max(0, Math.min(height, y)),
        size: getAdjustedSize(),
        rotation: rng.range(0, 360),
        colorIndex: Math.floor(rng.next() * colorCount),
        id: `shape-${i}`,
      })
    }
  } else {
    for (let i = 0; i < count; i++) {
      positions.push({
        x: rng.range(0, width),
        y: rng.range(0, height),
        size: getAdjustedSize(),
        rotation: rng.range(0, 360),
        colorIndex: Math.floor(rng.next() * colorCount),
        id: `shape-${i}`,
      })
    }
  }

  return positions
}

const exportToPNG = (canvas, filename = "design.png") => {
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    }
  })
}

const exportToJSON = (config, filename = "design.json") => {
  const json = JSON.stringify(config, null, 2)
  const blob = new Blob([json], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result)
        resolve(config)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

// ==================== Main Component ====================
function Decoration() {
  const [activeTab, setActiveTab] = useState("shape")
  const [canvasRef, setCanvasRef] = useState(null)

  const [config, setConfig] = useState({
    shape: {
      type: "circle",
      width: 50,
      height: 50,
    },
    colors: {
      background: "#1e293b",
      stops: [
        { id: "1", color: "#06b6d4", percentage: 33.33 },
        { id: "2", color: "#6366f1", percentage: 33.33 },
        { id: "3", color: "#8b5cf6", percentage: 33.34 },
      ],
      useGradient: false,
    },
    pattern: {
      density: 150,
      minSize: 15,
      maxSize: 40,
      opacity: 80,
      seed: 1234,
      edgeSoftness: 20,
      finish: "glossy",
      designType: "random",
    },
  })

  const positions = useMemo(() => {
    return generateShapePositions(
      config.pattern.density,
      config.pattern.seed,
      config.pattern.minSize,
      config.pattern.maxSize,
      800,
      600,
      config.pattern.designType,
      config.colors.stops.length,
      config.shape.width,
      config.shape.height
    )
  }, [
    config.pattern.density,
    config.pattern.seed,
    config.pattern.minSize,
    config.pattern.maxSize,
    config.pattern.designType,
    config.colors.stops.length,
    config.shape.width,
    config.shape.height
  ])

  const handleExportPNG = useCallback(() => {
    if (canvasRef) {
      exportToPNG(canvasRef)
    }
  }, [canvasRef])

  const handleExportJSON = useCallback(() => {
    exportToJSON(config)
  }, [config])

  const handleImportJSON = useCallback(async (file) => {
    try {
      const importedConfig = await importFromJSON(file)
      setConfig(importedConfig)
    } catch (error) {
      console.error("Failed to import JSON:", error)
      alert("Failed to import design. Please check the file format.")
    }
  }, [])

  const tabs = [
    { id: "shape", label: "Shape" },
    { id: "colors", label: "Colors" },
    { id: "pattern", label: "Pattern" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-16 md:pt-20 pb-8">
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent mb-1 md:mb-2">
            Decoration Designer
          </h1>
          <p className="text-sm md:text-base text-slate-400">
            Create beautiful patterns with shapes, colors, and effects
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 md:gap-6">
          {/* Left Panel */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="bg-slate-800/50 rounded-xl md:rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden sticky top-16 md:top-20 backdrop-blur-lg">
              <div className="flex border-b border-slate-700/50">
                {tabs.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-2 md:px-4 py-3 md:py-4 text-xs md:text-sm font-medium transition-all
                      ${
                        activeTab === id
                          ? "text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-500"
                          : "text-slate-400 hover:text-slate-300 hover:bg-slate-700/50"
                      }
                    `}
                  >
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              <div className="p-3 md:p-6 max-h-[400px] md:max-h-[600px] overflow-y-auto custom-scrollbar">
                {activeTab === "shape" && (
                  <ShapePanel
                    shapeType={config.shape.type}
                    width={config.shape.width}
                    height={config.shape.height}
                    onShapeTypeChange={(type) =>
                      setConfig((prev) => ({
                        ...prev,
                        shape: { ...prev.shape, type },
                      }))
                    }
                    onWidthChange={(width) =>
                      setConfig((prev) => ({
                        ...prev,
                        shape: { ...prev.shape, width },
                      }))
                    }
                    onHeightChange={(height) =>
                      setConfig((prev) => ({
                        ...prev,
                        shape: { ...prev.shape, height },
                      }))
                    }
                  />
                )}

                {activeTab === "colors" && (
                  <ColorsPanel
                    background={config.colors.background}
                    colorStops={config.colors.stops}
                    useGradient={config.colors.useGradient}
                    onBackgroundChange={(background) =>
                      setConfig((prev) => ({
                        ...prev,
                        colors: { ...prev.colors, background },
                      }))
                    }
                    onColorStopsChange={(stops) =>
                      setConfig((prev) => ({
                        ...prev,
                        colors: { ...prev.colors, stops },
                      }))
                    }
                    onUseGradientChange={(useGradient) =>
                      setConfig((prev) => ({
                        ...prev,
                        colors: { ...prev.colors, useGradient },
                      }))
                    }
                  />
                )}

                {activeTab === "pattern" && (
                  <PatternPanel
                    density={config.pattern.density}
                    minSize={config.pattern.minSize}
                    maxSize={config.pattern.maxSize}
                    opacity={config.pattern.opacity}
                    seed={config.pattern.seed}
                    edgeSoftness={config.pattern.edgeSoftness}
                    finish={config.pattern.finish}
                    designType={config.pattern.designType}
                    onDensityChange={(density) =>
                      setConfig((prev) => ({
                        ...prev,
                        pattern: { ...prev.pattern, density },
                      }))
                    }
                    onMinSizeChange={(minSize) =>
                      setConfig((prev) => ({
                        ...prev,
                        pattern: { ...prev.pattern, minSize },
                      }))
                    }
                    onMaxSizeChange={(maxSize) =>
                      setConfig((prev) => ({
                        ...prev,
                        pattern: { ...prev.pattern, maxSize },
                      }))
                    }
                    onOpacityChange={(opacity) =>
                      setConfig((prev) => ({
                        ...prev,
                        pattern: { ...prev.pattern, opacity },
                      }))
                    }
                    onSeedChange={(seed) =>
                      setConfig((prev) => ({
                        ...prev,
                        pattern: { ...prev.pattern, seed },
                      }))
                    }
                    onEdgeSoftnessChange={(edgeSoftness) =>
                      setConfig((prev) => ({
                        ...prev,
                        pattern: { ...prev.pattern, edgeSoftness },
                      }))
                    }
                    onFinishChange={(finish) =>
                      setConfig((prev) => ({
                        ...prev,
                        pattern: { ...prev.pattern, finish },
                      }))
                    }
                    onDesignTypeChange={(designType) =>
                      setConfig((prev) => ({
                        ...prev,
                        pattern: { ...prev.pattern, designType },
                      }))
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="col-span-1 md:col-span-2 lg:col-span-6">
            <div className="bg-slate-800/50 rounded-xl md:rounded-2xl shadow-xl border border-slate-700/50 p-3 md:p-6 aspect-video md:aspect-[4/3] backdrop-blur-lg">
              <DesignCanvas config={config} positions={positions} onCanvasReady={setCanvasRef} />
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <SidePanel
              colorStops={config.colors.stops}
              onExportPNG={handleExportPNG}
              onExportJSON={handleExportJSON}
              onImportJSON={handleImportJSON}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Decoration