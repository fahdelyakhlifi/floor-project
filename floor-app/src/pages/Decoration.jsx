//C:\Users\Fahd-EL\Desktop\projet stage\Projet Floor\floor-app\src\pages\Decoration.jsx

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"   // ← ADD THIS

import {
  Menu,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  CheckSquare,
  PieChart,
  Sliders,
  Calendar,
  ChevronRight,
  Hammer,
  Wrench,
  Ruler,
  Layers,
  ListOrdered,
  Droplet,
  Waves,
  MinusSquare,
} from "lucide-react"
import { Stage, Layer, Line, Rect, Group, Text, Transformer, Circle } from "react-konva"

/* ------------------------- Constants & Palettes ------------------------- */
const NAV_HEIGHT = 72
const MODAL_GAP = 20 // space between navbar bottom and modal top

const COLORS = [
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

const CUSTOM_COLORS = [
  { name: "Fire Engine", value: "#CE2B2B" },
  { name: "Hog", value: "#B0A5A3" },
]

const MARKER_COLOR = "#3b82f6"

const TEMPLATE_PLACEHOLDERS = [
  { id: "tpl1", name: "Marble A (placeholder)" },
  { id: "tpl2", name: "Granite B (placeholder)" },
  { id: "tpl3", name: "Terrazzo C (placeholder)" },
  { id: "tpl4", name: "Mosaic D (placeholder)" },
  { id: "tpl5", name: "Slate E (placeholder)" },
  { id: "tpl6", name: "Travertine F (placeholder)" },
]

const FOUR_BASE_COLORS = [
  { name: "tan", value: "#D2B48C" },
  { name: "gray", value: "#808080" },
  { name: "white", value: "#ffffff" },
  { name: "black", value: "#000000" },
]

/* ------------------------- Helper: default state snapshot ------------------------- */
const defaultMeasurements = [
  { wall: "A", length: 300 },
  { wall: "B", length: 200 },
  { wall: "C", length: 300 },
  { wall: "D", length: 200 },
]

/* ------------------------- Main Component ------------------------- */
const Decoration = () => {

  const navigate = useNavigate(); // ← ADD THIS

  /* ------------------------- UI / Mode state ------------------------- */
  const [designMode, setDesignMode] = useState("room") // 'room' | 'chip'
  const [showTopControls, setShowTopControls] = useState(false)

  /* ------------------------- Chip / Base color state ------------------------- */
  const [baseColor, setBaseColor] = useState(FOUR_BASE_COLORS[0].value)
  const [baseColorName, setBaseColorName] = useState(FOUR_BASE_COLORS[0].name)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showFourBasePicker, setShowFourBasePicker] = useState(false)
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const [showBaseSwatchModal, setShowBaseSwatchModal] = useState(false)
  const [showAddColorCard, setShowAddColorCard] = useState(false)

  /* ------------------------- App state (rooms / menus / sidebar) ------------------------- */
  const [showMenu, setShowMenu] = useState(false)
  // note: removed submenu usage (Design tool submenu removed)
  const [showNewRoomModal, setShowNewRoomModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [rooms, setRooms] = useState([])

  /* ------------------------- Drawing state (room design) ------------------------- */
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawingMode, setDrawingMode] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const [sidebarView, setSidebarView] = useState("main") // 'main' | 'products'
  const [selectedProducts, setSelectedProducts] = useState([])

  const [lines, setLines] = useState([]) // freehand lines
  const [shapes, setShapes] = useState([]) // generated shapes
  const [selectedShapeId, setSelectedShapeId] = useState(null)

  /* ------------------------- Measurements & view ------------------------- */
  const [measurements, setMeasurements] = useState(defaultMeasurements)

  const [roomView, setRoomView] = useState({ scale: 1, pos: { x: 0, y: 0 } })
  const [chipView, setChipView] = useState({ scale: 1, pos: { x: 0, y: 0 } })
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 })

  /* ------------------------- Refs and helpers ------------------------- */
  const sideBodyRef = useRef(null)
  const [scrollIntent, setScrollIntent] = useState(null)

  const containerRef = useRef(null)
  const stageRef = useRef(null)
  const trRef = useRef(null)
  const inputRefs = useRef({})
  const menuRef = useRef(null)

  // UPDATED: added "Create Template" menu item (Plus icon) between Design tool and Estimates
  const menuItems = [
    { name: "Presentation", icon: PieChart },
    { name: "Design tool", icon: Sliders },
    { name: "Create Template", icon: Plus },
    { name: "Estimates", icon: CheckSquare },
    { name: "Exit Appointment", icon: Calendar },
  ]
  const jobTypes = ["Garage", "Patio", "Pool Deck", "Driveway", "Basement", "Kitchen", "Bathroom", "Living Room"]

  /* ------------------------- Fit stage to parent container ------------------------- */
  const fitStageToParent = useCallback(() => {
    const container = containerRef.current
    const stage = stageRef.current
    if (!container || !stage) return
    const rect = container.getBoundingClientRect()
    stage.width(rect.width)
    stage.height(rect.height)
    setStageSize({ width: rect.width, height: rect.height })
    stage.draw()
  }, [])

  /* ------------------------- Reset entire app state to defaults ------------------------- */
  const resetToInitialState = useCallback(() => {
    // UI state
    setDesignMode("room")
    setShowTopControls(false)

    // base color
    setBaseColor(FOUR_BASE_COLORS[0].value)
    setBaseColorName(FOUR_BASE_COLORS[0].name)
    setShowColorPicker(false)
    setShowFourBasePicker(false)
    setShowTemplatePicker(false)
    setSelectedTemplate(null)
    setShowBaseSwatchModal(false)
    setShowAddColorCard(false)

    // menus & modals
    setShowMenu(false)
    setShowNewRoomModal(false)
    setShowDeleteModal(false)

    // rooms & sidebar
    setSelectedRoom(null)
    setRooms([])
    setIsSidebarCollapsed(true)
    setSidebarView("main")
    setSelectedProducts([])

    // drawing & shapes
    setIsDrawing(false)
    setDrawingMode(true)
    setLines([])
    setShapes([])
    setSelectedShapeId(null)

    // measurements & views
    setMeasurements(defaultMeasurements)
    setRoomView({ scale: 1, pos: { x: 0, y: 0 } })
    setChipView({ scale: 1, pos: { x: 0, y: 0 } })
    setStageSize({ width: 0, height: 0 })

    // small UX: scroll sidebar to top
    if (sideBodyRef.current) sideBodyRef.current.scrollTo({ top: 0, behavior: "auto" })

    // ensure stage gets updated
    setTimeout(() => {
      try {
        fitStageToParent()
      } catch (err) {
        // ignore
      }
    }, 0)
    console.log("App reset to initial state")
  }, [fitStageToParent])

  /* ------------------------- ROOM management (create / delete) ------------------------- */
  const handleAddRoom = useCallback((roomType) => {
    const newRoom = { id: Date.now(), type: roomType, name: roomType }
    setRooms((prev) => [...prev, newRoom])
    setSelectedRoom(newRoom)
    setShowNewRoomModal(false)
    setIsSidebarCollapsed(false)
    console.log(`${roomType} room created`)
  }, [])

  const handleDeleteRoom = useCallback(() => {
    if (selectedRoom) setShowDeleteModal(true)
    else console.log("Please select a room to delete (no toast shown)")
  }, [selectedRoom])

  const confirmDelete = useCallback(() => {
    setShowDeleteModal(false)
    resetToInitialState()
  }, [resetToInitialState])

  const cancelDelete = useCallback(() => setShowDeleteModal(false), [])

  /* ------------------------- Effects: resize, room change, mode change, menu outside click ------------------------- */
  useEffect(() => {
    fitStageToParent()
    const onResize = () => fitStageToParent()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [fitStageToParent])

  useEffect(() => {
    if (!selectedRoom) return
    setLines([])
    setShapes([])
    setSelectedShapeId(null)
    setTimeout(() => fitStageToParent(), 0)
  }, [selectedRoom, fitStageToParent])

  useEffect(() => {
    setDrawingMode(designMode !== "chip")
    if (designMode === "chip") setChipView({ scale: 1, pos: { x: 0, y: 0 } })
    setShowBaseSwatchModal(false)
  }, [designMode])

  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    if (showMenu) document.addEventListener("mousedown", onDocClick)
    else document.removeEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [showMenu])

  useEffect(() => {
    if (!sideBodyRef.current) return
    if (scrollIntent === "top") sideBodyRef.current.scrollTo({ top: 0, left: 0, behavior: "auto" })
    else if (scrollIntent === "bottom")
      requestAnimationFrame(() =>
        sideBodyRef.current?.scrollTo({ top: sideBodyRef.current.scrollHeight, behavior: "smooth" }),
      )
    if (scrollIntent) setScrollIntent(null)
  }, [sidebarView, scrollIntent])

  useEffect(() => {
    setScrollIntent("top")
  }, [designMode])

  useEffect(() => {
    const handler = (e) => {
      if (!selectedShapeId) return
      const big = e.altKey ? 50 : e.shiftKey ? 10 : 1
      const key = e.key.toLowerCase()
      const map = {
        arrowup: { dx: 0, dy: -big },
        w: { dx: 0, dy: -big },
        arrowdown: { dx: 0, dy: +big },
        s: { dx: 0, dy: +big },
        arrowleft: { dx: -big, dy: 0 },
        a: { dx: -big, dy: 0 },
        arrowright: { dx: +big, dy: 0 },
        d: { dx: +big, dy: 0 },
      }
      if (map[key]) {
        e.preventDefault()
        const { dx, dy } = map[key]
        setShapes((prev) =>
          prev.map((sh) =>
            sh.id === selectedShapeId ? { ...sh, x: Math.max(0, sh.x + dx), y: Math.max(0, sh.y + dy) } : sh,
          ),
        )
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [selectedShapeId])

  /* ------------------------- Drawing handlers ------------------------- */
  const handlePointerDown = (e) => {
    if (!drawingMode || designMode === "chip") return
    setIsDrawing(true)
    const pos = e.target.getStage().getPointerPosition()
    if (!pos) return
    setLines((prev) => [...prev, { points: [pos.x, pos.y] }])
  }
  const handlePointerMove = (e) => {
    if (!isDrawing || !drawingMode || designMode === "chip") return
    const stage = e.target.getStage()
    if (!stage) return
    const point = stage.getPointerPosition()
    if (!point) return
    setLines((prev) => {
      const last = prev[prev.length - 1]
      const newPoints = last.points.concat([point.x, point.y])
      return [...prev.slice(0, -1), { points: newPoints }]
    })
  }
  const endDrawing = () => setIsDrawing(false)

  const resetDrawing = () => {
    setLines([])
    setShapes([])
    setSelectedShapeId(null)
    stageRef.current?.batchDraw()
    console.log("Canvas cleared")
  }

  const bboxFromPoints = (pts) => {
    let minX = Number.POSITIVE_INFINITY,
      minY = Number.POSITIVE_INFINITY,
      maxX = Number.NEGATIVE_INFINITY,
      maxY = Number.NEGATIVE_INFINITY
    for (let i = 0; i < pts.length; i += 2) {
      const x = pts[i],
        y = pts[i + 1]
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
    return { x: minX, y: minY, width: Math.max(0, maxX - minX), height: Math.max(0, maxY - minY) }
  }

  const processDrawing = () => {
    if (!lines.length) {
      console.log("No drawing detected")
      return
    }
    const lastLine = lines[lines.length - 1]
    const bbox = bboxFromPoints(lastLine.points)
    if (!bbox || bbox.width < 2 || bbox.height < 2) {
      console.log("Drawing too small")
      stageRef.current?.batchDraw()
      return
    }

    const initA = Math.round(bbox.width * 0.9)
    const initC = Math.round(bbox.width * 0.9)
    const initB = Math.round(bbox.height * 0.9)
    const initD = Math.round(bbox.height * 0.9)

    const newShape = { id: Date.now().toString(), x: bbox.x, y: bbox.y }
    setShapes((prev) => [...prev, newShape])
    setSelectedShapeId(newShape.id)

    setMeasurements([
      { wall: "A", length: initA },
      { wall: "B", length: initB },
      { wall: "C", length: initC },
      { wall: "D", length: initD },
    ])

    setLines([])
    console.log("Design generated")
  }

  const getAC = () => ({
    A: measurements.find((m) => m.wall === "A")?.length ?? 0,
    C: measurements.find((m) => m.wall === "C")?.length ?? 0,
  })
  const getBD = () => ({
    B: measurements.find((m) => m.wall === "B")?.length ?? 0,
    D: measurements.find((m) => m.wall === "D")?.length ?? 0,
  })

  const polyAndBBoxFromMeasurements = () => {
    const { A, C } = getAC()
    const { B, D } = getBD()

    const maxW = Math.max(20, Math.max(A, C))
    const maxH = Math.max(20, Math.max(B, D))

    const topLx = (maxW - A) / 2
    const topRx = topLx + A

    const botLx = (maxW - C) / 2
    const botRx = botLx + C

    const TL = { x: topLx, y: 0 }
    const TR = { x: topRx, y: 0 }
    const BR = { x: botRx, y: B }
    const BL = { x: botLx, y: D }

    const points = [TL.x, TL.y, TR.x, TR.y, BR.x, BR.y, BL.x, BL.y]
    const bbox = { width: maxW, height: maxH }
    return { points, bbox, TL, TR, BR, BL }
  }

  const updateMeasurement = (wall, rawVal) => {
    const val = Number(rawVal)
    const safe = Number.isFinite(val) && val >= 0 ? val : 0
    setMeasurements((prev) => prev.map((m) => (m.wall === wall ? { ...m, length: safe } : m)))
  }

  const onTransformEnd = (id, node) => {
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()
    const newW = Math.max(20, node.width() * scaleX)
    const newH = Math.max(20, node.height() * scaleY)
    node.scaleX(1)
    node.scaleY(1)

    const parentGroup = node.getParent()
    const { x, y } = parentGroup.position()

    setMeasurements((prev) =>
      prev.map((m) => {
        if (m.wall === "A" || m.wall === "C") {
          return { ...m, length: Math.max(0, Math.round(m.length * (newW / node.width()))) }
        } else {
          return { ...m, length: Math.max(0, Math.round(m.length * (newH / node.height()))) }
        }
      }),
    )

    setShapes((prev) => prev.map((s) => (s.id === id ? { ...s, x, y } : s)))
  }

  const penCursor =
    selectedRoom && drawingMode && designMode !== "chip"
      ? 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41L18.37 3.29a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="%23000"/></svg>\') 0 24, crosshair'
      : "default"

  const handleWheel = (e) => {
    if (designMode === "chip") {
      e.evt.preventDefault()
      return
    }
    e.evt.preventDefault()
    const stage = stageRef.current
    const oldScale = roomView.scale
    const pointer = stage?.getPointerPosition()
    if (!stage || !pointer) return
    const scaleBy = 1.05
    const direction = e.evt.deltaY > 0 ? -1 : 1
    const newScale = Math.min(3, Math.max(0.25, direction > 0 ? oldScale * scaleBy : oldScale / scaleBy))
    const mousePointTo = { x: (pointer.x - roomView.pos.x) / oldScale, y: (pointer.y - roomView.pos.y) / oldScale }
    const newPos = { x: pointer.x - mousePointTo.x * newScale, y: pointer.y - mousePointTo.y * newScale }
    setRoomView({ scale: newScale, pos: newPos })
  }

  const zoomTo = (target) => {
    const clamped = Math.max(0.25, Math.min(3, target))
    if (designMode === "chip") setChipView({ scale: 1, pos: { x: 0, y: 0 } })
    else setRoomView((v) => ({ ...v, scale: clamped }))
  }

  const resetView = () => {
    if (designMode === "chip") setChipView({ scale: 1, pos: { x: 0, y: 0 } })
    else setRoomView({ scale: 1, pos: { x: 0, y: 0 } })
  }

  const allProductsValid = useMemo(() => {
    if (selectedProducts.length === 0) return false
    return selectedProducts.every((p) => Object.values(p.fields).every((v) => v !== "" && !Number.isNaN(Number(v))))
  }, [selectedProducts])

  const hasCanvasContent = shapes.length > 0 || lines.length > 0

  const noiseImage = useMemo(() => {
    const s = 128
    const c = document.createElement("canvas")
    c.width = s
    c.height = s
    const g = c.getContext("2d")
    const img = g.createImageData(s, s)
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 255) | 0
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v
      img.data[i + 3] = 28
    }
    g.putImageData(img, 0, 0)
    const out = new window.Image()
    out.src = c.toDataURL()
    return out
  }, [])

  const currentView = designMode === "chip" ? chipView : roomView

  // UPDATED: onMenuItemClick now handles "Create Template" directly.
  const onMenuItemClick = (name) => {
    if (name === "Create Template") {
      setShowMenu(false)
      navigate("/create-template")
      console.log("Navigating to /create-template from main menu")
      return
    }

    // keep previous behavior for Design tool: just close menu (no submenu)
    if (name === "Design tool") {
      setShowMenu(false)
      console.log("Design tool selected (no submenu)")
      return
    }

    setShowMenu(false)
    console.log(`${name} selected`)
  }

  const onAddColorClick = () => {
    setShowAddColorCard(true)
  }

  const applyColor = (colorObj) => {
    setBaseColor(colorObj.value)
    setBaseColorName(colorObj.name)
    setShowAddColorCard(false)
    setShowColorPicker(false)
    setShowFourBasePicker(false)
    setShowBaseSwatchModal(false)
    console.log(`Color applied: ${colorObj.name}`)
  }

  /* ------------------------- Render ------------------------- */
  return (
    <div className="fixed inset-0 bg-white overflow-hidden z-0" style={{ top: NAV_HEIGHT }}>
      {!selectedRoom && (
        <div className="absolute top-6 left-6 z-30">
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setShowMenu((s) => !s)
              }}
              className="w-14 h-14 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 text-white rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowNewRoomModal(true)}
              className="w-14 h-14 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center"
              aria-label="Add room"
            >
              <Plus className="w-6 h-6" />
            </button>
            <button
              onClick={handleDeleteRoom}
              className="w-14 h-14 bg-gradient-to-br from-rose-600 via-rose-500 to-red-600 text-white rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center"
              aria-label="Delete room"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {showMenu && (
        <div
          ref={menuRef}
          className="absolute top-24 left-6 bg-white rounded-2xl shadow-2xl w-64 z-50 border border-gray-200"
        >
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Navigation</h3>
            <button
              onClick={() => {
                setShowMenu(false)
              }}
              className="text-gray-400 hover:text-gray-700"
            >
              Close
            </button>
          </div>
          <div className="p-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index}>
                  <button
                    onClick={() => onMenuItemClick(item.name)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                    {/* Design tool no longer shows a submenu indicator */}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div
        className={`relative h-full w-full transition-all duration-300 ${selectedRoom && !isSidebarCollapsed ? "ml-80" : ""}`}
        ref={containerRef}
      >
        <Stage
          ref={stageRef}
          className="w-full h-full"
          style={{ cursor: penCursor }}
          scaleX={currentView.scale}
          scaleY={currentView.scale}
          x={currentView.pos.x}
          y={currentView.pos.y}
          onWheel={handleWheel}
          draggable={designMode !== "chip" && !drawingMode}
          onDragEnd={(e) => {
            if (designMode === "chip") return
            const p = e.target.position()
            setRoomView((v) => ({ ...v, pos: p }))
          }}
          onMouseDown={selectedRoom ? handlePointerDown : undefined}
          onTouchStart={selectedRoom ? handlePointerDown : undefined}
          onMouseMove={selectedRoom ? handlePointerMove : undefined}
          onTouchMove={selectedRoom ? handlePointerMove : undefined}
          onMouseUp={selectedRoom ? endDrawing : undefined}
          onTouchEnd={selectedRoom ? endDrawing : undefined}
        >
          <Layer>
            {designMode === "chip" && (
              <Rect x={0} y={0} width={stageSize.width} height={stageSize.height} fill={baseColor} listening={false} />
            )}

            {designMode !== "chip" &&
              lines.map((l, idx) => (
                <Line key={idx} points={l.points} stroke="#111827" strokeWidth={3} lineCap="round" lineJoin="round" />
              ))}

            {designMode === "room" &&
              shapes.map((shape) => {
                const { points, bbox, TL, TR, BR, BL } = polyAndBBoxFromMeasurements()
                const mids = {
                  A: { x: (TL.x + TR.x) / 2, y: (TL.y + TR.y) / 2 },
                  B: { x: (TR.x + BR.x) / 2, y: (TR.y + BR.y) / 2 },
                  C: { x: (BR.x + BL.x) / 2, y: (BR.y + BL.y) / 2 },
                  D: { x: (BL.x + TL.x) / 2, y: (BL.y + TL.y) / 2 },
                }
                const marker = (label, pos) => (
                  <Group
                    x={pos.x}
                    y={pos.y}
                    key={label}
                    onClick={() => {
                      const el = inputRefs.current[label.toUpperCase()]
                      if (el) {
                        el.focus()
                        el.select?.()
                      }
                    }}
                  >
                    <Circle
                      radius={8.5}
                      fill={MARKER_COLOR}
                      stroke="#ffffff"
                      strokeWidth={2}
                      shadowColor={MARKER_COLOR}
                      shadowBlur={10}
                      shadowOpacity={0.85}
                    />
                    <Text
                      text={label.toUpperCase()}
                      fontSize={10}
                      fontStyle="700"
                      fill="#ffffff"
                      offsetX={3}
                      offsetY={5}
                    />
                  </Group>
                )
                return (
                  <Group
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    draggable
                    onDragEnd={(e) => {
                      const { x, y } = e.target.position()
                      setShapes((prev) => prev.map((s) => (s.id === shape.id ? { ...s, x, y } : s)))
                    }}
                    onClick={(e) => {
                      setSelectedShapeId(shape.id)
                      const tr = trRef.current
                      const group = e.currentTarget
                      const proxy = group.findOne(".resize-proxy")
                      if (proxy) {
                        tr.nodes([proxy])
                        tr.getLayer().batchDraw()
                      }
                    }}
                  >
                    <Rect
                      name="resize-proxy"
                      id={shape.id}
                      x={0}
                      y={0}
                      width={bbox.width}
                      height={bbox.height}
                      opacity={0}
                      onTransformEnd={(e) => onTransformEnd(shape.id, e.target)}
                    />
                    <Group
                      clipFunc={(ctx) => {
                        ctx.beginPath()
                        ctx.moveTo(points[0], points[1])
                        for (let i = 2; i < points.length; i += 2) ctx.lineTo(points[i], points[i + 1])
                        ctx.closePath()
                      }}
                    >
                      <Rect
                        x={0}
                        y={0}
                        width={bbox.width}
                        height={bbox.height}
                        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                        fillLinearGradientEndPoint={{ x: bbox.width, y: bbox.height }}
                        fillLinearGradientColorStops={[0, "#0b0f14", 0.35, baseColor, 0.65, "#0b0f14", 1, "#080b0f"]}
                        listening={false}
                      />
                      <Rect
                        x={0}
                        y={0}
                        width={bbox.width}
                        height={bbox.height}
                        fillRadialGradientStartPoint={{ x: bbox.width / 2, y: bbox.height / 2 }}
                        fillRadialGradientStartRadius={0}
                        fillRadialGradientEndPoint={{ x: bbox.width / 2, y: bbox.height / 2 }}
                        fillRadialGradientEndRadius={Math.max(bbox.width, bbox.height)}
                        fillRadialGradientColorStops={[0, "#0000", 1, "#0009"]}
                        listening={false}
                        opacity={0.7}
                      />
                      {noiseImage && (
                        <Rect
                          x={0}
                          y={0}
                          width={bbox.width}
                          height={bbox.height}
                          fillPatternImage={noiseImage}
                          opacity={0.18}
                          listening={false}
                        />
                      )}
                    </Group>
                    <Line
                      points={points}
                      closed
                      stroke="#0e141b"
                      strokeWidth={6}
                      shadowColor="#000"
                      shadowBlur={12}
                      shadowOffset={{ x: 5, y: 7 }}
                      shadowOpacity={0.32}
                      listening={false}
                    />
                    <Line points={points} closed stroke="#9aa4b2" strokeWidth={1.2} opacity={0.6} listening={false} />
                    <Line points={points} closed stroke="#ffffff22" strokeWidth={1} dash={[10, 7]} listening={false} />
                    {[TL, TR, BR, BL].map((p, i) => (
                      <Circle key={i} x={p.x} y={p.y} radius={2.6} fill="#9fb5ff" opacity={0.6} listening={false} />
                    ))}
                    {marker("a", mids.A)}
                    {marker("b", mids.B)}
                    {marker("c", mids.C)}
                    {marker("d", mids.D)}
                  </Group>
                )
              })}

            <Transformer
              ref={trRef}
              rotateEnabled={false}
              anchorSize={10}
              borderStroke="#3b82f6"
              anchorStroke="#3b82f6"
              onTransformEnd={() => {
                const list = trRef.current?.nodes?.()
                const node = list && list[0]
                if (!node) return
                onTransformEnd(node.id(), node)
              }}
            />
          </Layer>
        </Stage>

        {showTopControls && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 border border-gray-200 rounded-full shadow px-1 py-1 flex items-center gap-1">
            <button
              onClick={() => setDesignMode("room")}
              className={`px-4 py-2 rounded-full text-sm ${designMode === "room" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              Room Design
            </button>
            <button
              onClick={() => setDesignMode("chip")}
              className={`px-4 py-2 rounded-full text-sm ${designMode === "chip" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
            >
              Chip Design
            </button>
          </div>
        )}

        {hasCanvasContent && designMode !== "chip" && (
          <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 flex w-full justify-center">
            <div className="pointer-events-auto bg-white/90 backdrop-blur border border-gray-200 rounded-full shadow-lg px-3 py-2 flex items-center gap-2">
              <button
                onClick={() => zoomTo(roomView.scale / 1.1)}
                className="w-9 h-9 rounded-full border flex items-center justify-center active:scale-95"
              >
                -
              </button>
              <input
                aria-label="Zoom"
                type="range"
                min="0.25"
                max="3"
                step="0.05"
                value={roomView.scale}
                onChange={(e) => zoomTo(Number.parseFloat(e.target.value))}
                className="w-40"
              />
              <button
                onClick={() => zoomTo(roomView.scale * 1.1)}
                className="w-9 h-9 rounded-full border flex items-center justify-center active:scale-95"
              >
                +
              </button>
              <button onClick={resetView} className="ml-2 px-3 py-1.5 rounded-full border text-sm hover:bg-gray-100">
                Reset
              </button>
              <button
                onClick={() => {
                  setShowTopControls(true)
                  setDesignMode("chip")
                }}
                disabled={!allProductsValid}
                className={`ml-2 px-4 py-2 rounded-full text-sm shadow ${allProductsValid ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedRoom && isSidebarCollapsed && (
        <div className="absolute left-6 top-6 z-40">
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="w-14 h-14 bg-blue-600 rounded-2xl shadow-lg flex items-center justify-center text-white hover:bg-blue-500 transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Sidebar (unchanged) */}
      {selectedRoom && !isSidebarCollapsed && (
        <aside
          className="w-80 bg-white shadow-2xl border-r border-gray-200 fixed left-0 z-40 flex flex-col"
          style={{ top: NAV_HEIGHT, height: `calc(100vh - ${NAV_HEIGHT}px)` }}
        >
          <div className="sticky top-0 z-20 h-24 border-b border-gray-200 bg-gradient-to-r from-blue-100 to-blue-50 px-6">
            <div className="h-full flex items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedRoom?.type ?? "New Room"}</h2>
                <p className="text-gray-600 text-sm mt-1">Room Design Studio</p>
              </div>
            </div>
          </div>

          <div ref={sideBodyRef} className="p-6 pt-6 pb-28 space-y-4 flex-1 overflow-y-auto">
            {/* top actions visible in both modes */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              <button
                onClick={() => {
                  setShowMenu((s) => !s)
                }}
                className="p-3 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 text-white rounded-xl shadow-lg flex items-center justify-center"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowNewRoomModal(true)}
                className="p-3 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white rounded-xl shadow-lg flex items-center justify-center"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={handleDeleteRoom}
                className="p-3 bg-gradient-to-br from-rose-600 via-rose-500 to-red-600 text-white rounded-xl shadow-lg flex items-center justify-center"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {designMode === "chip" ? (
              <>
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-3">Base color</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowBaseSwatchModal(true)}
                      className="w-14 h-14 rounded-md shadow-sm border flex-shrink-0 focus:outline-none transition-transform hover:scale-105"
                      style={{ backgroundColor: baseColor }}
                      aria-label="Open base color modal"
                    />
                    <div className="text-sm text-gray-700 capitalize">{baseColorName.replaceAll("_", " ")}</div>
                  </div>
                </div>

                {showBaseSwatchModal && (
                  <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-50"
                    style={{ paddingTop: NAV_HEIGHT + MODAL_GAP }}
                    onMouseDown={(e) => {
                      if (e.target === e.currentTarget) setShowBaseSwatchModal(false)
                    }}
                  >
                    <style>{`
                      .flow-modal-enter {
                        animation: flowIn 260ms cubic-bezier(.2,.9,.3,1) forwards;
                      }
                      @keyframes flowIn {
                        from { opacity: 0; transform: translateY(-8px) scale(.98); }
                        to   { opacity: 1; transform: translateY(0) scale(1); }
                      }
                    `}</style>

                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-[min(560px,90vw)] max-w-[560px] flow-modal-enter flex flex-col" role="dialog" aria-modal="true">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Base Colors</h3>
                      <div className="grid grid-cols-4 gap-4 overflow-y-auto" style={{ maxHeight: "calc(80vh - 120px)" }}>
                        {FOUR_BASE_COLORS.map((c) => (
                          <button
                            key={c.name}
                            onClick={() => applyColor(c)}
                            className="flex flex-col items-center gap-3 p-2 rounded hover:bg-gray-50 focus:outline-none transition-colors"
                            aria-label={`Select ${c.name}`}
                            title={c.name.replaceAll("_", " ")}
                          >
                            <div className="w-20 h-20 rounded-md shadow border border-gray-200" style={{ backgroundColor: c.value }} />
                            <span className="capitalize text-sm text-gray-800 mt-1">{c.name.replaceAll("_", " ")}</span>
                          </button>
                        ))}
                      </div>
                      <div className="mt-6 flex justify-center">
                        <button onClick={() => setShowBaseSwatchModal(false)} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Close</button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : sidebarView === "main" ? (
              <>
                <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 flex items-center space-x-2">
                      <Edit3 className="w-4 h-4 text-blue-600" />
                      <span>Drawing Controls</span>
                    </h3>
                  </div>
                  <div className="flex items-center justify-between mb-3 p-2 bg-gray-100 rounded">
                    <span className="font-medium text-gray-900 text-sm">Drawing Mode</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={drawingMode} onChange={(e) => setDrawingMode(e.target.checked)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={resetDrawing} className="flex items-center justify-center space-x-1 py-2 px-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                      <RefreshCw className="w-4 h-4" />
                      <span>Reset</span>
                    </button>
                    <button onClick={processDrawing} className="flex items-center justify-center space-x-1 py-2 px-3 bg-blue-600 text-white rounded hover:bg-blue-700">
                      <CheckSquare className="w-4 h-4" />
                      <span>Process</span>
                    </button>
                  </div>
                </div>

                {shapes.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Measurements</h3>
                    </div>
                    <div className="p-0">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 text-gray-600">
                            <th className="text-left py-2 px-4 w-20">Wall</th>
                            <th className="text-left py-2 px-4">Length</th>
                          </tr>
                        </thead>
                        <tbody>
                          {measurements.map((m, i) => (
                            <tr key={m.wall} className={i % 2 ? "bg-white" : "bg-gray-50"}>
                              <td className="py-2 px-4 font-semibold text-gray-900">{m.wall}</td>
                              <td className="py-2 px-4">
                                <div className="relative">
                                  <input
                                    ref={(el) => (inputRefs.current[m.wall] = el)}
                                    type="number"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    value={m.length}
                                    onChange={(e) => updateMeasurement(m.wall, e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg pl-3 pr-16 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold bg-gray-900 text-white px-2 py-1 rounded">inch</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Floor Preparation</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="Bare Concrete">
                      {["Bare Concrete", "Paint", "Epoxy", "Tile", "Cool Deck", "Carpet Removal"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedProducts.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg">Products</h3>
                    <ul className="space-y-3">
                      {selectedProducts.map((p) => (
                        <li key={p.id} className="border border-gray-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">{p.type}</span>
                            <button onClick={() => setSelectedProducts((prev) => prev.filter((x) => x.id !== p.id))} className="w-8 h-8 bg-red-100 rounded-full text-red-700">×</button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            {Object.keys(p.fields).map((k) => (
                              <label key={k} className="text-sm md:text-base text-gray-700">
                                {k.replaceAll("_", " ")}
                                <input
                                  type="number"
                                  value={p.fields[k]}
                                  onChange={(e) => {
                                    const v = e.target.value
                                    setSelectedProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, fields: { ...x.fields, [k]: v } } : x)))
                                  }}
                                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5"
                                />
                              </label>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-6 px-4">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Room Options</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: "Crack Repair", Icon: Hammer, fields: { length_ft: "" } },
                    { type: "Divot Repair", Icon: Wrench, fields: { count: "" } },
                    { type: "Knee Wall", Icon: Ruler, fields: { length_ft: "", height_ft: "" } },
                    { type: "Apron", Icon: Layers, fields: { length_ft: "", width_in: "" } },
                    { type: "Stairs", Icon: ListOrdered, fields: { count: "", width_in: "", depth_in: "" } },
                    { type: "Hydro Stop", Icon: Droplet, fields: { sq_ft: "" } },
                    { type: "Grit", Icon: Layers, fields: { sq_ft: "" } },
                    { type: "Pool Edge Prep", Icon: Waves, fields: { length_ft: "" } },
                    { type: "Standard Deduction", Icon: MinusSquare, fields: { sq_ft: "" } },
                  ].map((item) => (
                    <button
                      key={item.type}
                      onClick={() => {
                        setSelectedProducts((prev) => [...prev, { id: Date.now().toString() + Math.random(), type: item.type, fields: item.fields }])
                        setSidebarView("main")
                        setScrollIntent("bottom")
                      }}
                      className="flex flex-col items-center justify-center gap-2 p-4 border border-gray-200 rounded-xl h-28"
                    >
                      <item.Icon className="w-7 h-7 text-gray-800" />
                      <span className="text-xs font-medium text-gray-900 text-center leading-tight">{item.type}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* bottom sticky area (unchanged) */}
          {designMode === "chip" ? (
            <div className="sticky bottom-0 border-t border-gray-200 bg-white p-3 w-80 shrink-0">
              <div className="flex items-center gap-2">
                <button onClick={onAddColorClick} className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white rounded-xl py-3 hover:bg-blue-500">Add Color</button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-900 rounded-xl py-3 hover:bg-gray-300" onClick={() => setShowTemplatePicker(true)}>Standard Blend</button>
              </div>
            </div>
          ) : (
            <div className="sticky bottom-0 border-t border-gray-200 bg-white p-3 w-80 shrink-0">
              <button onClick={() => { setSidebarView("products"); setScrollIntent("top") }} className="w-full inline-flex items-center justify-center gap-2 bg-black text-white rounded-xl py-3">+ Add Product</button>
              {!allProductsValid && selectedProducts.length > 0 && (<p className="text-[11px] text-amber-700 mt-2">Fill all product fields with numbers or remove the product to enable Continue.</p>)}
            </div>
          )}
        </aside>
      )}

      {/* Template picker, color pickers, add color modal, create room modal, delete modal are kept unchanged semantically */}
      {showTemplatePicker && designMode === "chip" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50" style={{ paddingTop: NAV_HEIGHT + MODAL_GAP }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[min(720px,90vw)]">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Choose a Standard Blend (Templates)</h3>
            <p className="text-sm text-gray-500 mb-4 text-center">Placeholders — choose a template.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {TEMPLATE_PLACEHOLDERS.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    setSelectedTemplate(tpl)
                    setShowTemplatePicker(false)
                    console.log(`Template ${tpl.name} selected`)
                    setChipView({ scale: 1, pos: { x: 0, y: 0 } })
                  }}
                  className={`border rounded-xl p-4 text-left hover:bg-gray-50 ${selectedTemplate?.id === tpl.id ? "border-blue-500" : "border-gray-200"}`}
                >
                  <div className="h-24 mb-3 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-500">Placeholder</div>
                  <div className="font-medium text-gray-900 text-sm">{tpl.name}</div>
                  <div className="text-xs text-gray-500">ID: {tpl.id}</div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <button onClick={() => setShowTemplatePicker(false)} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Close</button>
              {selectedTemplate && (<button onClick={() => { setShowTemplatePicker(false); setShowColorPicker(true) }} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white">Next: Add Colors</button>)}
            </div>
          </div>
        </div>
      )}

      {showFourBasePicker && designMode === "chip" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50" style={{ paddingTop: NAV_HEIGHT + MODAL_GAP }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[min(420px,90vw)]">
            <h3 className="text-2xl font-bold text-gray-900 mb-1 text-center">Base Colors</h3>
            <div className="grid grid-cols-4 gap-4">
              {FOUR_BASE_COLORS.map((c) => (
                <button key={c.name} onClick={() => applyColor(c)} className="flex flex-col items-center gap-2">
                  <span className="w-16 h-16 rounded shadow border" style={{ background: c.value }} />
                  <span className="capitalize text-sm text-gray-800">{c.name.replaceAll("_", " ")}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <button onClick={() => setShowFourBasePicker(false)} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Close</button>
            </div>
          </div>
        </div>
      )}

      {showColorPicker && designMode === "chip" && !showAddColorCard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50" style={{ paddingTop: NAV_HEIGHT + MODAL_GAP }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[min(480px,90vw)]">
            <h3 className="text-2xl font-bold text-gray-900 mb-1 text-center">Choose base color</h3>
            <p className="text-xs text-gray-500 mb-4 text-center">Template: {selectedTemplate ? selectedTemplate.name : "—"}</p>
            <div className="grid grid-cols-4 gap-4">
              {FOUR_BASE_COLORS.map((c) => (
                <button key={c.name} onClick={() => { setBaseColor(c.value); setBaseColorName(c.name); setShowColorPicker(false); console.log(`Base color set to ${c.name}`) }} className="flex flex-col items-center gap-2">
                  <span className="w-16 h-16 rounded shadow border" style={{ background: c.value }} />
                  <span className="capitalize text-sm text-gray-800">{c.name.replaceAll("_", " ")}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <button onClick={() => setShowColorPicker(false)} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300">Close</button>
            </div>
          </div>
        </div>
      )}

{showAddColorCard && (
  <div
    className="fixed inset-0 z-50 flex justify-center backdrop-blur-md bg-black/20"
    style={{ paddingTop: NAV_HEIGHT + MODAL_GAP }}
    onMouseDown={(e) => { if (e.target === e.currentTarget) setShowAddColorCard(false) }}
  >
    <div className="mt-6"> {/* small margin so modal not glued to top of overlay */}
      <div
        className="bg-white rounded-2xl w-[min(560px,90vw)] max-w-[560px] shadow-2xl p-6 mx-4 flex flex-col"
        style={{ maxHeight: "calc(100vh - 160px)" }}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-full text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Add Color</h3>
            <p className="text-sm text-gray-500">Choose a color to add to your design</p>
          </div>

          <button
            onClick={() => setShowAddColorCard(false)}
            className="ml-4 text-gray-400 hover:text-gray-700 p-2 rounded"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Colors grid (4 columns) */}
        <div className="overflow-y-auto" style={{ flex: "1 1 auto", paddingRight: 6 }}>
          <div className="grid grid-cols-4 gap-4">
            {COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => applyColor({ name: c.name, value: c.value })}
                className="relative flex flex-col items-center gap-3 p-2 rounded-lg hover:shadow-sm transition"
                title={c.name.replaceAll("_", " ")}
              >
                <div
                  style={{ background: c.value }}
                  className="w-20 h-20 rounded-lg shadow-sm border border-gray-200"
                />
                <div className="text-xs text-gray-700 lowercase tracking-wide">{c.name.replaceAll("_", " ")}</div>
              </button>
            ))}
          </div>

          {/* separator */}
          <div className="mt-4 mb-3 border-t border-gray-100" />

          {/* Custom Colors heading */}
          <div className="mb-2">
            <div className="text-sm font-semibold text-gray-700">Custom Colors</div>
          </div>

          {/* Custom colors row (2 items) */}
          <div className="grid grid-cols-4 gap-4 mb-2">
            {CUSTOM_COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => applyColor({ name: c.name, value: c.value })}
                className="relative flex flex-col items-center gap-3 p-2 rounded-lg hover:shadow-sm transition"
                title={c.name}
              >
                <div
                  style={{ background: c.value }}
                  className="w-20 h-20 rounded-lg shadow-sm border border-gray-200"
                />
                <div className="text-xs text-gray-700 lowercase tracking-wide">{c.name}</div>
              </button>
            ))}

            {/* keep layout balanced: two empty slots */}
            <div />
            <div />
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      {showNewRoomModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50" style={{ paddingTop: NAV_HEIGHT + MODAL_GAP }}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 mx-4 border border-gray-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><Plus className="w-8 h-8 text-blue-600" /></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Create New Room</h3>
              <p className="text-gray-600">Select room type to start designing</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Room Type:</label>
                <select id="room-type-select" className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Select room type</option>
                  {jobTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <button onClick={() => setShowNewRoomModal(false)} className="bg-gray-200 text-gray-900 py-3 px-6 rounded-xl">Cancel</button>
                <button onClick={() => { const select = document.getElementById("room-type-select"); const roomType = select?.value; if (roomType) handleAddRoom(roomType); else console.log("Please select a room type") }} className="bg-blue-600 text-white py-3 px-6 rounded-xl">Create Room</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50" style={{ paddingTop: NAV_HEIGHT + MODAL_GAP }}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-96 mx-4 border border-gray-200">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6"><Trash2 className="w-8 h-8 text-red-600" /></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Delete Room?</h3>
              <p className="text-gray-600 mb-8">Are you sure you want to remove the room "{selectedRoom?.type}"? This action will return the page to its initial state.</p>
              <div className="flex space-x-4">
                <button onClick={cancelDelete} className="flex-1 bg-gray-200 text-gray-900 py-3 px-6 rounded-xl">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Decoration
