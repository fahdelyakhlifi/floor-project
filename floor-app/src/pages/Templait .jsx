// CreateTemplatePage.jsx
// Standalone Create Template page (React + Tailwind + Canvas)
// - 3-column layout: left controls, center live canvas, right palette + presets + catalog
// - Speckle/flake generator (canvas 2D)
// - Palette editor with percentage validation + normalize
// - Presets (built-in) and ability to save/load templates to localStorage
// - Export PNG / Export JSON
// NOTE: This is a single-file React component. Paste into your project and ensure Tailwind is configured.
// Reference design screenshot (local): /mnt/data/2025-11-15_185052.png

import React, { useEffect, useRef, useState } from "react"

// ---------------------------
// Source colors (from your list)
// ---------------------------
const SOURCE_COLORS = [
  { name: "sticks", value: "#C9A66B" },
  { name: "surf", value: "#9FD3C7" },
  { name: "snow", value: "#F7FBFF" },
  { name: "sea_foam", value: "#BFE7D5" },
  { name: "dune", value: "#D8C3A5" },
  { name: "sand", value: "#EED9B6" },
  { name: "flint", value: "#6B6F72" },
  { name: "pebble", value: "#A6A8AB" },
  { name: "porpoise", value: "#5F6B6B" },
  { name: "f16", value: "#2C3E50" },
  { name: "camel", value: "#C79C6E" },
  { name: "whisper", value: "#E6EEF2" },
  { name: "sky", value: "#8FCDF8" },
  { name: "ocean", value: "#0E76A8" },
  { name: "sapphire", value: "#0F52BA" },
  { name: "arctic", value: "#D7F2FF" },
  { name: "space", value: "#0B1020" },
  { name: "cocoa", value: "#6B3E26" },
  { name: "ash", value: "#B2BEB5" },
  { name: "jet_black", value: "#0B0B0B" },
]

// ---------------------------
// Built-in presets (10) — from previous spec
// ---------------------------
const PRESETS = [
  {
    id: "preset_cloak",
    name: "Cloak",
    palette: [
      { name: "jet_black", value: "#0B0B0B", pct: 25 },
      { name: "flint", value: "#6B6F72", pct: 30 },
      { name: "ash", value: "#B2BEB5", pct: 25 },
      { name: "snow", value: "#F7FBFF", pct: 20 },
    ],
    pattern: { type: "speckle", density: 0.65, minSize: 6, maxSize: 16, shape: "irregular", edgeSoftness: 0.12, seed: 1 },
  },
  {
    id: "preset_graphite",
    name: "Graphite",
    palette: [
      { name: "space", value: "#0B1020", pct: 30 },
      { name: "f16", value: "#2C3E50", pct: 25 },
      { name: "flint", value: "#6B6F72", pct: 25 },
      { name: "ash", value: "#B2BEB5", pct: 20 },
    ],
    pattern: { type: "speckle", density: 0.72, minSize: 5, maxSize: 18, shape: "shard", edgeSoftness: 0.08, seed: 2 },
  },
  {
    id: "preset_gravel",
    name: "Gravel",
    palette: [
      { name: "pebble", value: "#A6A8AB", pct: 40 },
      { name: "porpoise", value: "#5F6B6B", pct: 25 },
      { name: "ash", value: "#B2BEB5", pct: 20 },
      { name: "snow", value: "#F7FBFF", pct: 15 },
    ],
    pattern: { type: "speckle", density: 0.55, minSize: 7, maxSize: 18, shape: "chip", edgeSoftness: 0.18, seed: 3 },
  },
  {
    id: "preset_ocean",
    name: "Ocean Drift",
    palette: [
      { name: "ocean", value: "#0E76A8", pct: 40 },
      { name: "sapphire", value: "#0F52BA", pct: 20 },
      { name: "surf", value: "#9FD3C7", pct: 20 },
      { name: "snow", value: "#F7FBFF", pct: 20 },
    ],
    pattern: { type: "speckle", density: 0.58, minSize: 6, maxSize: 16, shape: "irregular", edgeSoftness: 0.14, seed: 4 },
  },
  {
    id: "preset_bluelagoon",
    name: "Blue Lagoon",
    palette: [
      { name: "sapphire", value: "#0F52BA", pct: 35 },
      { name: "ocean", value: "#0E76A8", pct: 25 },
      { name: "sky", value: "#8FCDF8", pct: 15 },
      { name: "snow", value: "#F7FBFF", pct: 25 },
    ],
    pattern: { type: "speckle", density: 0.62, minSize: 5, maxSize: 14, shape: "chip", edgeSoftness: 0.1, seed: 5 },
  },
  {
    id: "preset_safari",
    name: "Safari",
    palette: [
      { name: "camel", value: "#C79C6E", pct: 40 },
      { name: "sticks", value: "#C9A66B", pct: 25 },
      { name: "dune", value: "#D8C3A5", pct: 20 },
      { name: "sand", value: "#EED9B6", pct: 15 },
    ],
    pattern: { type: "speckle", density: 0.54, minSize: 8, maxSize: 20, shape: "irregular", edgeSoftness: 0.16, seed: 6 },
  },
  {
    id: "preset_cookie",
    name: "Cookie",
    palette: [
      { name: "sand", value: "#EED9B6", pct: 45 },
      { name: "dune", value: "#D8C3A5", pct: 30 },
      { name: "whisper", value: "#E6EEF2", pct: 15 },
      { name: "pebble", value: "#A6A8AB", pct: 10 },
    ],
    pattern: { type: "speckle", density: 0.48, minSize: 9, maxSize: 22, shape: "rounded", edgeSoftness: 0.22, seed: 7 },
  },
  {
    id: "preset_hog",
    name: "Hog",
    palette: [
      { name: "flint", value: "#6B6F72", pct: 45 },
      { name: "ash", value: "#B2BEB5", pct: 30 },
      { name: "camel", value: "#C79C6E", pct: 10 },
      { name: "sticks", value: "#C9A66B", pct: 15 },
    ],
    pattern: { type: "speckle", density: 0.66, minSize: 6, maxSize: 18, shape: "shard", edgeSoftness: 0.1, seed: 8 },
  },
  {
    id: "preset_arctic",
    name: "Arctic",
    palette: [
      { name: "arctic", value: "#D7F2FF", pct: 50 },
      { name: "whisper", value: "#E6EEF2", pct: 25 },
      { name: "ash", value: "#B2BEB5", pct: 15 },
      { name: "snow", value: "#F7FBFF", pct: 10 },
    ],
    pattern: { type: "speckle", density: 0.36, minSize: 4, maxSize: 12, shape: "chip", edgeSoftness: 0.2, seed: 9 },
  },
  {
    id: "preset_tuxedo",
    name: "Tuxedo",
    palette: [
      { name: "jet_black", value: "#0B0B0B", pct: 45 },
      { name: "snow", value: "#F7FBFF", pct: 45 },
      { name: "ash", value: "#B2BEB5", pct: 10 },
    ],
    pattern: { type: "speckle", density: 0.7, minSize: 6, maxSize: 16, shape: "irregular", edgeSoftness: 0.06, seed: 10 },
  },
]

// ---------------------------
// Helpers: random, weighted pick
// ---------------------------
function seededRandom(seed) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return function () {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function pickColorByWeight(palette, r) {
  // r in [0,100)
  let acc = 0
  for (let i = 0; i < palette.length; i++) {
    acc += Number(palette[i].pct || 0)
    if (r < acc) return palette[i].value
  }
  return palette[palette.length - 1].value
}

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)) }

// ---------------------------
// Canvas speckle renderer
// ---------------------------
function renderSpeckleToCanvas(canvas, cfg) {
  const { palette, density, minSize, maxSize, shape, edgeSoftness, seed } = cfg
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const size = Math.max(200, Math.min(1200, cfg.canvasSize || 600))
  canvas.width = size
  canvas.height = size
  // clear
  ctx.fillStyle = cfg.background || '#ffffff'
  ctx.fillRect(0,0,size,size)

  const rnd = seededRandom(seed || Date.now())
  const area = size * size
  // heuristic: flakes per area
  const flakesCount = Math.round(area * density * 0.0025)

  // two-pass rendering: base pass and accent pass if layers specified
  for (let i = 0; i < flakesCount; i++) {
    const x = Math.floor(rnd() * size)
    const y = Math.floor(rnd() * size)
    const rPick = rnd() * 100
    const color = pickColorByWeight(palette, rPick)

    const s = Math.round(minSize + rnd() * (maxSize - minSize))
    drawFlake(ctx, x, y, s, color, shape, rnd)
  }

  // slight overlay noise for realism
  ctx.globalAlpha = 0.06
  for (let i = 0; i < size * 0.6; i++) {
    const x = Math.floor(rnd() * size)
    const y = Math.floor(rnd() * size)
    ctx.fillStyle = '#000'
    ctx.fillRect(x,y,1,1)
  }
  ctx.globalAlpha = 1
}

function drawFlake(ctx, x, y, size, color, shape, rnd) {
  // simplified irregular polygon flakes
  const sides = shape === 'rounded' ? 12 : 3 + Math.floor(rnd() * 5) // 3..7
  const angleStep = (Math.PI*2)/sides
  ctx.beginPath()
  for (let k=0;k<sides;k++){
    const radius = size * (0.5 + rnd()*0.9)
    const a = k*angleStep + (rnd()-0.5)*0.6
    const px = x + Math.cos(a)*radius
    const py = y + Math.sin(a)*radius
    if (k===0) ctx.moveTo(px,py)
    else ctx.lineTo(px,py)
  }
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()

  // inner subtle highlight
  ctx.beginPath()
  ctx.arc(x + (rnd()-0.5)*size*0.12, y + (rnd()-0.5)*size*0.12, Math.max(1, size*0.28), 0, Math.PI*2)
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.fill()
}

// ---------------------------
// Local storage helpers (catalog)
// ---------------------------
const LS_KEY = 'ct_templates_v1'
function loadCatalog() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch (e) { return [] }
}
function saveCatalog(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list))
}

// ---------------------------
// Main React component
// ---------------------------
export default function CreateTemplatePage({ onApply }) {
  // canvas ref
  const canvasRef = useRef(null)

  // template state
  const [name, setName] = useState('New Template')
  const [category, setCategory] = useState('Standard Blends')
  const [background, setBackground] = useState('#ffffff')

  // palette: default start with first 3 source colors
  const [palette, setPalette] = useState([
    { name: SOURCE_COLORS[0].name, value: SOURCE_COLORS[0].value, pct: 60 },
    { name: SOURCE_COLORS[6].name, value: SOURCE_COLORS[6].value, pct: 25 },
    { name: SOURCE_COLORS[2].name, value: SOURCE_COLORS[2].value, pct: 15 },
  ])

  const [pattern, setPattern] = useState({ type: 'speckle', density: 0.6, minSize:6, maxSize:16, shape:'irregular', edgeSoftness:0.12, seed: Date.now() })
  const [canvasSize, setCanvasSize] = useState(600)

  // catalog
  const [catalog, setCatalog] = useState(loadCatalog())

  // UI
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [unsaved, setUnsaved] = useState(false)

  // derived
  const paletteTotal = palette.reduce((s,p)=>s+Number(p.pct||0),0)

  // re-render preview on changes
  useEffect(()=>{
    const cfg = { palette, density: pattern.density, minSize: pattern.minSize, maxSize: pattern.maxSize, shape: pattern.shape, edgeSoftness: pattern.edgeSoftness, seed: pattern.seed, canvasSize, background }
    renderSpeckleToCanvas(canvasRef.current, cfg)
  }, [palette, pattern, canvasSize, background])

  // load presets on mount into catalog if empty
  useEffect(()=>{
    if (catalog.length === 0) {
      const fromPresets = PRESETS.map(p => ({ id: p.id, name: p.name, palette: p.palette, pattern: p.pattern, createdAt: new Date().toISOString(), thumbnail: null }))
      setCatalog(fromPresets)
      saveCatalog(fromPresets)
    }
  }, [])

  // helpers
  function applyPreset(preset) {
    setPalette(preset.palette.map(c=>({ name:c.name, value:c.value, pct:c.pct })))
    setPattern({ ...preset.pattern })
    setSelectedPreset(preset.id)
    setUnsaved(true)
  }

  function updatePaletteAt(i, patch) {
    setPalette(prev => prev.map((it, idx) => idx===i ? { ...it, ...patch } : it))
    setUnsaved(true)
  }
  function addPaletteColor() {
    setPalette(prev => [...prev, { name: 'custom', value: '#888888', pct: 0 }])
    setUnsaved(true)
  }
  function removePaletteColor(i) {
    setPalette(prev => prev.filter((_,idx)=>idx!==i))
    setUnsaved(true)
  }
  function normalizePalette() {
    const total = palette.reduce((s,p)=>s+Number(p.pct||0),0) || 1
    setPalette(prev => prev.map(p => ({ ...p, pct: Math.round((p.pct/total)*100) })))
    // correct drift
    setTimeout(()=>{
      const t = palette.reduce((s,p)=>s+Number(p.pct||0),0)
      if (t !== 100 && palette.length>0) {
        setPalette(prev => { const cp = [...prev]; cp[0].pct += (100 - t); return cp })
      }
    }, 0)
    setUnsaved(true)
  }

  function saveTemplate() {
    if (!name || name.trim() === '') { alert('Name required'); return }
    if (paletteTotal !== 100) { if (!confirm(`Palette total is ${paletteTotal}%. Normalize to 100%?`)) return; normalizePalette() }
    // generate thumbnail
    const thumb = canvasRef.current.toDataURL('image/png')
    const tpl = {
      id: `tpl_${Date.now()}`,
      name,
      category,
      thumbnail: thumb,
      canvasSize,
      palette,
      pattern,
      metadata: { createdAt: new Date().toISOString() }
    }
    const newCat = [tpl, ...catalog]
    setCatalog(newCat)
    saveCatalog(newCat)
    setUnsaved(false)
    alert('Template saved to local catalog')
  }

  function exportJSON(tpl) {
    const data = JSON.stringify(tpl, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${tpl.name || 'template'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportPNG() {
    const data = canvasRef.current.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = data
    a.download = `${name || 'template'}.png`
    a.click()
  }

  function loadTemplateToEditor(tpl) {
    setName(tpl.name)
    setCategory(tpl.category || 'Standard Blends')
    setPalette(tpl.palette.map(p=>({ name:p.name, value:p.value, pct:p.pct })))
    setPattern({ ...tpl.pattern })
    setCanvasSize(tpl.canvasSize || 600)
    setSelectedPreset(null)
    setUnsaved(false)
    // ensure preview updates
    setTimeout(()=>{
      const cfg = { palette: tpl.palette, density: tpl.pattern.density, minSize: tpl.pattern.minSize, maxSize: tpl.pattern.maxSize, shape: tpl.pattern.shape, edgeSoftness: tpl.pattern.edgeSoftness, seed: tpl.pattern.seed, canvasSize: tpl.canvasSize || 600, background }
      renderSpeckleToCanvas(canvasRef.current, cfg)
    }, 50)
  }

  function deleteFromCatalog(id) {
    if (!confirm('Delete template?')) return
    const newCat = catalog.filter(t=>t.id !== id)
    setCatalog(newCat)
    saveCatalog(newCat)
  }

  function applyToProject() {
    // if parent supplies onApply, call it with a template object
    const tpl = { id: `tpl_temp_${Date.now()}`, name, category, palette, pattern, canvasSize }
    if (typeof onApply === 'function') onApply(tpl)
    else alert('applyToProject: ' + JSON.stringify(tpl).slice(0,200) + '...')
  }

  // small UI helpers
  function quickDensity(level) {
    const map = { Light:0.35, Medium:0.55, Heavy:0.75, Full:0.95 }
    setPattern(prev=>({ ...prev, density: map[level] || prev.density }))
    setUnsaved(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1400px] mx-auto bg-white rounded-xl shadow p-4">
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button className="px-3 py-2 bg-gray-100 rounded">← Back</button>
            <h1 className="text-xl font-semibold">Create Template</h1>
            {unsaved && <span className="text-sm text-amber-600 ml-3">Unsaved changes</span>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportPNG} className="px-3 py-2 bg-green-600 text-white rounded">Export PNG</button>
            <button onClick={()=>exportJSON({ name, category, palette, pattern, canvasSize })} className="px-3 py-2 bg-gray-800 text-white rounded">Export JSON</button>
            <button onClick={saveTemplate} className="px-3 py-2 bg-blue-600 text-white rounded">Save</button>
            <button onClick={applyToProject} className="px-3 py-2 bg-indigo-600 text-white rounded">Apply</button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-4">
          {/* Left controls */}
          <aside className="col-span-3 space-y-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">General</h3>
              <label className="text-sm block">Name</label>
              <input value={name} onChange={(e)=>{ setName(e.target.value); setUnsaved(true) }} className="w-full p-2 border rounded mb-2" />
              <label className="text-sm block">Category</label>
              <input value={category} onChange={(e)=>{ setCategory(e.target.value); setUnsaved(true) }} className="w-full p-2 border rounded mb-2" />
              <label className="text-sm block">Canvas size (px)</label>
              <input type="number" value={canvasSize} onChange={(e)=>{ setCanvasSize(Number(e.target.value)); setUnsaved(true) }} className="w-full p-2 border rounded" />
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Pattern</h3>
              <label className="text-sm block mb-1">Type</label>
              <select value={pattern.type} onChange={(e)=>{ setPattern(p=>({...p,type:e.target.value})); setUnsaved(true) }} className="w-full p-2 border rounded mb-2">
                <option value="speckle">Speckle (flakes)</option>
                <option value="tile">Tile</option>
                <option value="herringbone">Herringbone</option>
                <option value="circle">Circle scatter</option>
                <option value="star">Star motif</option>
              </select>

              <label className="text-sm block mb-1">Density</label>
              <input type="range" min={0.05} max={1} step={0.01} value={pattern.density} onChange={(e)=>{ setPattern(p=>({...p,density: Number(e.target.value)})); setUnsaved(true) }} className="w-full mb-2" />
              <div className="flex gap-2 mb-3">
                <button onClick={()=>quickDensity('Light')} className="px-2 py-1 bg-gray-100 rounded text-sm">Light</button>
                <button onClick={()=>quickDensity('Medium')} className="px-2 py-1 bg-gray-100 rounded text-sm">Medium</button>
                <button onClick={()=>quickDensity('Heavy')} className="px-2 py-1 bg-gray-100 rounded text-sm">Heavy</button>
                <button onClick={()=>quickDensity('Full')} className="px-2 py-1 bg-gray-100 rounded text-sm">Full</button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm block">Min size</label>
                  <input type="number" value={pattern.minSize} onChange={(e)=>{ setPattern(p=>({...p,minSize: Number(e.target.value)})); setUnsaved(true) }} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="text-sm block">Max size</label>
                  <input type="number" value={pattern.maxSize} onChange={(e)=>{ setPattern(p=>({...p,maxSize: Number(e.target.value)})); setUnsaved(true) }} className="w-full p-2 border rounded" />
                </div>
              </div>

              <label className="text-sm block mt-2">Shape</label>
              <select value={pattern.shape} onChange={(e)=>{ setPattern(p=>({...p,shape:e.target.value})); setUnsaved(true) }} className="w-full p-2 border rounded mb-2">
                <option value="irregular">Irregular</option>
                <option value="chip">Chip</option>
                <option value="shard">Shard</option>
                <option value="rounded">Rounded</option>
              </select>

              <label className="text-sm block">Seed</label>
              <div className="flex gap-2">
                <input type="number" value={pattern.seed} onChange={(e)=>{ setPattern(p=>({...p,seed: Number(e.target.value)})); setUnsaved(true) }} className="w-full p-2 border rounded" />
                <button onClick={()=>{ setPattern(p=>({...p,seed: Date.now()})); setUnsaved(true) }} className="px-3 py-2 bg-gray-100 rounded">Random</button>
              </div>

            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Background</h3>
              <input type="color" value={background} onChange={(e)=>{ setBackground(e.target.value); setUnsaved(true) }} className="w-16 h-10 p-0 border rounded" />
            </div>

          </aside>

          {/* Center canvas */}
          <main className="col-span-6 flex flex-col items-center">
            <div className="bg-gray-50 p-4 rounded shadow w-full flex flex-col items-center">
              <div className="border border-gray-200 bg-white rounded-lg p-4">
                <div className="w-[min(680px,72vw)] h-[min(680px,72vw)] bg-white rounded-md flex items-center justify-center">
                  <canvas ref={canvasRef} style={{ width: canvasSize, height: canvasSize, borderRadius: 8 }} />
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button onClick={()=>{ setPattern(p=>({...p,seed: Date.now()})); setUnsaved(true) }} className="px-3 py-2 bg-gray-100 rounded">Regenerate</button>
                <button onClick={()=>{ setPattern(p=>({...p,seed: Date.now()+1})); setUnsaved(true) }} className="px-3 py-2 bg-gray-100 rounded">Variant</button>
                <button onClick={()=>{ setPalette(SOURCE_COLORS.slice(0,3).map((c,i)=>({ name:c.name, value:c.value, pct: i===0?60: i===1?25:15 }))); setUnsaved(true) }} className="px-3 py-2 bg-gray-100 rounded">Reset Palette</button>
              </div>
            </div>

          </main>

          {/* Right: Palette, presets, catalog */}
          <aside className="col-span-3 space-y-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Palette</h3>
              <div className="space-y-2 max-h-60 overflow-auto">
                {palette.map((p,i)=> (
                  <div key={i} className="flex items-center gap-2">
                    <input type="color" value={p.value} onChange={(e)=> updatePaletteAt(i, { value: e.target.value }) } className="w-10 h-10 p-0 border rounded" />
                    <input value={p.value} onChange={(e)=> updatePaletteAt(i, { value: e.target.value }) } className="w-20 p-2 border rounded" />
                    <input type="number" value={p.pct} onChange={(e)=> updatePaletteAt(i, { pct: Number(e.target.value) }) } className="w-20 p-2 border rounded" />
                    <div className="flex-1 text-sm truncate">{p.name || '-'}</div>
                    <button onClick={()=>removePaletteColor(i)} className="px-2 py-1 bg-red-100 rounded">✕</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={addPaletteColor} className="px-3 py-2 bg-gray-100 rounded">+ Color</button>
                <button onClick={normalizePalette} className="px-3 py-2 bg-yellow-100 rounded">Normalize</button>
                <div className={`ml-auto px-3 py-2 rounded ${paletteTotal===100? 'bg-green-100 text-green-800' : 'bg-rose-100 text-rose-800'}`}>Total: {paletteTotal}%</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Presets</h3>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map(p => (
                  <button key={p.id} onClick={()=>applyPreset(p)} className="border rounded p-2 text-left hover:bg-gray-50">
                    <div className="h-12 w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-1 flex items-center justify-center">{p.name}</div>
                    <div className="text-xs text-gray-500">{p.pattern.type} • {Math.round(p.pattern.density*100)}%</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Catalog (Local)</h3>
              <div className="space-y-2 max-h-64 overflow-auto">
                {catalog.length===0 && <div className="text-sm text-gray-500">No saved templates</div>}
                {catalog.map(t => (
                  <div key={t.id} className="flex items-center gap-2 border rounded p-2">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                      {t.thumbnail ? <img src={t.thumbnail} alt={t.name} className="w-full h-full object-cover"/> : <div className="text-xs text-gray-400">No preview</div>}
                    </div>
                    <div className="flex-1 text-sm">
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.pattern?.type || '—'} • {t.pattern?.density ? Math.round(t.pattern.density*100)+'%' : ''}</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button onClick={()=>loadTemplateToEditor(t)} className="px-2 py-1 bg-gray-100 rounded text-sm">Load</button>
                      <button onClick={()=>exportJSON(t)} className="px-2 py-1 bg-gray-100 rounded text-sm">JSON</button>
                      <button onClick={()=>deleteFromCatalog(t.id)} className="px-2 py-1 bg-rose-100 rounded text-sm">Del</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  )
}
