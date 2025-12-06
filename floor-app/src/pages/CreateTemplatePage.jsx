// src/pages/CreateTemplatePage.jsx
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  Lock,
  Unlock,
  Trash2,
  Plus,
  Save,
  Image as ImageIcon,
  FolderOpen,
  Pencil,
  Search,
  Download,
  Upload,
  ChevronDown,
} from "lucide-react";

/* --------------------------------------------------------------------------
   1) UTILITAIRES GÉNÉRAUX (RNG, clamp, uid)
   -------------------------------------------------------------------------- */

// Générateur pseudo-aléatoire déterministe (pour garder un pattern stable
// avec la même seed)
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Force une valeur v à rester entre [a, b]
function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

// Petit id unique utilisé pour templates
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/* --------------------------------------------------------------------------
   2) PALETTE DE COULEURS (valeurs par défaut + bibliothèque)
   -------------------------------------------------------------------------- */

const DEFAULT_PALETTE = [
  { name: "jet_black", value: "#0B0B0B", pct: 45, locked: false },
  { name: "pebble", value: "#A6A8AB", pct: 35, locked: false },
  { name: "flint", value: "#6B6F72", pct: 20, locked: false },
];

// Couleurs personnalisées dans le modal "Custom Colors"
const CUSTOM_COLORS = [
  { name: "Fire Engine", value: "#CE2B2B" },
  { name: "Hog", value: "#B0A5A3" },
];

// Bibliothèque principale de couleurs dans le modal "Add Color"
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
];

/* --------------------------------------------------------------------------
   3) CONSTANTES POUR LES TAILLES & DENSITÉ
   -------------------------------------------------------------------------- */

// bornes pour minSize (slider)
const MIN_MIN_SIZE = 10;
const MAX_MIN_SIZE = 50;

// bornes pour maxSize (slider)
const MIN_MAX_SIZE = 30;
const MAX_MAX_SIZE = 110;

// Nombre max de shapes quand density = 100%
const MAX_ITEMS = 2500;
// Facteur global de densité (si tu veux plus ou moins de shapes à 100%)
const DENSITY_MULT = 1;

/* --------------------------------------------------------------------------
   4) ICÔNE DES SHAPES (petits pictos dans l’onglet SHAPE)
   -------------------------------------------------------------------------- */

const ShapeIcon = ({ type, className = "" }) => {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
  };

  if (type === "flakes")
    return (
      <svg {...common} className={className}>
        <path
          d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

  if (type === "circles")
    return (
      <svg {...common} className={className}>
        <circle cx="8" cy="8" r="2" />
        <circle cx="16" cy="16" r="3" />
      </svg>
    );

  // SQUARES : carrés arrondis
  if (type === "squares")
    return (
      <svg {...common} className={className}>
        <rect x="4" y="4" width="7" height="7" rx="2" />
        <rect x="13" y="13" width="7" height="7" rx="2" />
      </svg>
    );

  // TILE : triangle (motalat)
  if (type === "tile")
    return (
      <svg {...common} className={className}>
        <path d="M12 4 L20 18 L4 18 Z" />
      </svg>
    );

  if (type === "stars")
    return (
      <svg {...common} className={className}>
        <path d="M12 2l2.5 5.5L20 9l-4 3.5L17 20l-5-2.5L7 20l1-7.5L4 9l5.5-1.5L12 2z" />
      </svg>
    );

  // fallback
  return (
    <svg {...common} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 12h18M12 3v18" />
    </svg>
  );
};

/* --------------------------------------------------------------------------
   5) COMPOSANT PRINCIPAL
   -------------------------------------------------------------------------- */

export default function CreateTemplatePage() {
  /* -------------------------
     5.1) ÉTATS PRINCIPAUX
     ------------------------- */

  // Onglet actif (Shape / Colors / Save)
  const [activeTab, setActiveTab] = useState("shape");

  // Paramètres de pattern
  const [shapeType, setShapeType] = useState("flakes");
  const [widthScale, setWidthScale] = useState(1);
  const [heightScale, setHeightScale] = useState(1);
  const [minSize, setMinSize] = useState(20);
  const [maxSize, setMaxSize] = useState(80);

  // Densité (0-100 %) -> contrôle le NOMBRE de shapes
  const [density, setDensity] = useState(30);

  // Seed random -> garde le même rendu pour les mêmes paramètres
  const [seed, setSeed] = useState(12345);

  // Couleurs globales
  const [background, setBackground] = useState("#F7FBFF");
  const [palette, setPalette] = useState(DEFAULT_PALETTE);

  // Modals (Add Color, Templates Library)
  const [showAddColor, setShowAddColor] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  // Templates stockés en localStorage
  const [templates, setTemplates] = useState(() => {
    try {
      const raw = localStorage.getItem("crt_templates_v1");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // Nom du template courant
  const [templateName, setTemplateName] = useState("");

  // Recherche dans la librairie de templates
  const [templateSearch, setTemplateSearch] = useState("");
  // Template "actif" (pour faire apparaître icons sur mobile au tap)
  const [activeTemplateId, setActiveTemplateId] = useState(null);

  // Index de la couleur en cours d’édition (null = on ajoute une nouvelle)
  const [editingColorIndex, setEditingColorIndex] = useState(null);

  // Dropdown Export (PNG / JSON)
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Refs
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const exportMenuRef = useRef(null);

  // Taille du canvas de preview
  const previewSize = 500;

  // cachedItems : positions + couleur + facteur de taille
  const [cachedItems, setCachedItems] = useState([]);

  /* -------------------------
     5.2) GÉNÉRATION DES ITEMS (layout)
     ------------------------- */
  const generateItems = useCallback(() => {
    const rng = mulberry32(Number(seed));

    // densityFraction ∈ [0,1]
    const densityFraction = clamp(density / 100, 0, 1);

    // Nombre de shapes proportionnel à la densité
    const approxCount = Math.max(
      1,
      Math.floor(1 + densityFraction * (MAX_ITEMS - 1) * DENSITY_MULT)
    );

    // Poids = pct pour chaque couleur
    let weights = palette.map((c) => Math.max(0, c.pct || 0));
    let totalWeight = weights.reduce((s, w) => s + w, 0);

    // Si tous les pct == 0, on répartit uniformément
    if (totalWeight <= 0 || weights.length === 0) {
      weights = palette.map(() => 1);
      totalWeight = weights.reduce((s, w) => s + w, 0);
    }

    // Tableau cumulatif pour tirage pondéré
    const cumulative = [];
    let acc = 0;
    for (let w of weights) {
      acc += w;
      cumulative.push(acc);
    }

    function pickColorIndex(randomValue) {
      const target = randomValue * totalWeight;
      for (let i = 0; i < cumulative.length; i++) {
        if (target <= cumulative[i]) return i;
      }
      return cumulative.length - 1;
    }

    const items = [];
    for (let i = 0; i < approxCount; i++) {
      const x = rng() * previewSize;
      const y = rng() * previewSize;
      const unitFactor = rng(); // valeur 0..1, servira à calculer la taille
      const colorIndex = pickColorIndex(rng());
      items.push({ x, y, colorIndex, unitFactor });
    }

    setCachedItems(items);
  }, [seed, density, palette, previewSize]);

  /* -------------------------
     5.3) DESSIN DU CANVAS
     ------------------------- */

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!cachedItems || cachedItems.length === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = previewSize * dpr;
    canvas.height = previewSize * dpr;
    canvas.style.width = previewSize + "px";
    canvas.style.height = previewSize + "px";

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fond
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, previewSize, previewSize);

    // Dessin de chaque shape
    cachedItems.forEach((it) => {
      const s = minSize + it.unitFactor * (maxSize - minSize);
      const color = palette[it.colorIndex]?.value || "#000";
      const itemRng = mulberry32(Math.floor(it.unitFactor * 1000000));

      drawShape(
        ctx,
        it.x,
        it.y,
        s,
        color,
        shapeType,
        itemRng,
        widthScale,
        heightScale
      );
    });
  }, [
    cachedItems,
    minSize,
    maxSize,
    background,
    palette,
    shapeType,
    widthScale,
    heightScale,
    previewSize,
  ]);

  /* -------------------------
     5.4) DESSIN D’UNE SEULE SHAPE (AVEC OMBRE LÉGÈRE)
     ------------------------------------------------------------------
     -> ICI زدنا shadow خفيف باش منين shapes يتركبو فوق بعضياتهم
        يبان بحال كاين depth صغير بيناتهم.
     ------------------------------------------------------------------ */

  function drawShape(ctx, x, y, size, fill, type, rng, wScale, hScale) {
    const localRng = typeof rng === "function" ? rng : () => Math.random();

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(wScale, hScale);
    ctx.fillStyle = fill;

    // ---- OMBRE LÉGÈRE (DROP SHADOW) ----
    // On adapte un peu la force de l’ombre à la taille
    const blur = clamp(size * 0.06, 1, 6);        // flou léger
    const offset = size * 0.04;                   // décalage X/Y
    ctx.shadowColor = "rgba(0,0,0,0.18)";         // couleur d’ombre douce
    ctx.shadowBlur = blur;
    ctx.shadowOffsetX = offset;
    ctx.shadowOffsetY = offset;

    // Petite rotation pour effet plus organique
    let angle = 0;
    if (type === "tile") {
      angle = localRng() * Math.PI * 2;
    } else if (type === "squares" || type === "stars" || type === "flakes") {
      angle = (localRng() - 0.5) * 0.6; // environ ±34°
    }
    ctx.rotate(angle);
    ctx.beginPath();

    if (type === "circles") {
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === "squares") {
      const r = Math.max(2, size * 0.15);
      roundRect(ctx, -size / 2, -size / 2, size, size, r);
      ctx.fill();
    } else if (type === "stars") {
      const spikes = 5;
      const outer = size / 2;
      const inner = outer * 0.5;
      let a = (Math.PI / 2) * 3;
      ctx.moveTo(0, -outer);
      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(Math.cos(a) * outer, Math.sin(a) * outer);
        a += Math.PI / spikes;
        ctx.lineTo(Math.cos(a) * inner, Math.sin(a) * inner);
        a += Math.PI / spikes;
      }
      ctx.closePath();
      ctx.fill();
    } else if (type === "tile") {
      const h = (Math.sqrt(3) / 2) * size;
      ctx.moveTo(0, -h / 2);
      ctx.lineTo(-size / 2, h / 2);
      ctx.lineTo(size / 2, h / 2);
      ctx.closePath();
      ctx.fill();
    } else {
      // flakes : polygone irrégulier
      const points = 6 + Math.floor(localRng() * 4);
      const radius = size / 2;
      for (let i = 0; i < points; i++) {
        const theta =
          (i / points) * Math.PI * 2 + (localRng() - 0.5) * 0.3;
        const rr = radius * (0.6 + localRng() * 0.8);
        const px = Math.cos(theta) * rr;
        const py = Math.sin(theta) * rr;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    }

    // IMPORTANT : on enlève l’ombre pour ne pas impacter les prochains dessins
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.restore();
  }

  // Dessin d’un rectangle arrondi (utilisé pour "squares")
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /* -------------------------
     5.5) useEffect : génération + dessin + comportement menu export
     ------------------------- */

  useEffect(() => {
    generateItems();
  }, [generateItems]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  useEffect(() => {
    if (!showExportMenu) return;

    function handleClickOutside(e) {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(e.target)
      ) {
        setShowExportMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showExportMenu]);

  /* --------------------------------------------------------------------------
     6) GESTION PALETTE (normalisation, lock, edit, add, remove)
     -------------------------------------------------------------------------- */

  function normalizePalette(newPalette) {
    const lockedTotal = newPalette
      .filter((c) => c.locked)
      .reduce((s, c) => s + (c.pct || 0), 0);
    const unlocked = newPalette.filter((c) => !c.locked);
    const unlockedTotal = unlocked.reduce((s, c) => s + (c.pct || 0), 0);
    const target = Math.max(0, 100 - lockedTotal);

    if (unlocked.length === 0) {
      return newPalette.map((c) => ({
        ...c,
        pct: c.locked ? clamp(c.pct || 0, 0, 100) : 0,
      }));
    }

    if (unlockedTotal === 0) {
      const even = unlocked.map((c) => ({
        ...c,
        pct: target / unlocked.length,
      }));
      return newPalette.map((c) =>
        c.locked
          ? c
          : even.find(
              (e) => e.name === c.name && e.value === c.value
            ) || c
      );
    }

    const scale = target / unlockedTotal;
    const scaled = newPalette.map((c) =>
      c.locked
        ? c
        : {
            ...c,
            pct: (c.pct || 0) * scale,
          }
    );

    let sum = scaled.reduce((s, c) => s + (c.pct || 0), 0);
    let diff =
      100 - Math.round((sum + Number.EPSILON) * 100) / 100;

    if (Math.abs(diff) > 0.001) {
      const idx = scaled.findIndex((c) => !c.locked);
      if (idx >= 0) scaled[idx].pct = (scaled[idx].pct || 0) + diff;
    }

    return scaled.map((c) => ({
      ...c,
      pct: Math.round((c.pct + Number.EPSILON) * 100) / 100,
    }));
  }

  function updatePaletteItem(index, patch) {
    const current = palette[index];
    if (!current) return;

    if (
      current.locked &&
      Object.prototype.hasOwnProperty.call(patch, "pct")
    ) {
      return;
    }

    const next = palette.map((p, i) =>
      i === index ? { ...p, ...patch } : p
    );
    setPalette(normalizePalette(next));
  }

  function addColorFromSource(col) {
    const next = [
      ...palette,
      {
        name: col.name,
        value: col.value,
        pct: 0,
        locked: false,
      },
    ];
    setPalette(normalizePalette(next));
  }

  function handlePickColor(col) {
    if (
      editingColorIndex !== null &&
      editingColorIndex >= 0 &&
      editingColorIndex < palette.length
    ) {
      const next = palette.map((p, idx) =>
        idx === editingColorIndex
          ? {
              ...p,
              name: col.name,
              value: col.value,
            }
          : p
      );
      setPalette(normalizePalette(next));
    } else {
      addColorFromSource(col);
    }
    setShowAddColor(false);
    setEditingColorIndex(null);
  }

  function removePaletteIndex(i) {
    const next = palette.filter((_, idx) => idx !== i);
    setPalette(normalizePalette(next));
  }

  /* --------------------------------------------------------------------------
     7) GESTION TEMPLATES (save, load, export, import, delete)
     -------------------------------------------------------------------------- */

  function buildTemplateObject() {
    const canvas = canvasRef.current;
    const thumbnail = canvas ? canvas.toDataURL("image/png") : null;
    return {
      id: uid(),
      name: templateName.trim(),
      category: "",
      thumbnail,
      canvasSize: previewSize,
      palette: palette.map((p) => ({
        name: p.name,
        value: p.value,
        pct: p.pct,
      })),
      patternParams: {
        shapeType,
        widthScale,
        heightScale,
        minSize,
        maxSize,
        density,
        seed,
      },
      createdAt: new Date().toISOString(),
    };
  }

  function saveTemplate() {
    if (!templateName || templateName.trim().length === 0) {
      return;
    }
    const tpl = buildTemplateObject();
    const next = [tpl, ...templates];
    setTemplates(next);
    localStorage.setItem("crt_templates_v1", JSON.stringify(next));
    alert("Template saved locally.");
  }

  function exportPNG() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${(templateName || "pattern")
      .replace(/\s+/g, "_") || "pattern"}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function exportJSONTemplate(obj) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(obj.name || "template")
      .replace(/\s+/g, "_")}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function downloadCurrentTemplateJSON() {
    if (!templateName || templateName.trim().length === 0) {
      alert("Please enter a template name before downloading JSON.");
      return;
    }
    const tpl = buildTemplateObject();
    exportJSONTemplate(tpl);
  }

  function loadTemplate(tpl) {
    setTemplateName(tpl.name || "");
    setPalette(
      (tpl.palette || []).map((p) => ({
        ...p,
        locked: false,
      }))
    );
    const pat = tpl.patternParams || {};
    setShapeType(pat.shapeType || "flakes");
    setWidthScale(pat.widthScale || 1);
    setHeightScale(pat.heightScale || 1);
    setMinSize(pat.minSize || 6);
    setMaxSize(pat.maxSize || 40);

    if (pat.density !== undefined && pat.density <= 1) {
      setDensity(Math.round(pat.density * 100));
    } else {
      setDensity(pat.density ?? 30);
    }

    setSeed(pat.seed || (Date.now() % 100000));
  }

  function deleteTemplate(id) {
    const ok = window.confirm(
      "Are you sure you want to delete this template?"
    );
    if (!ok) return;
    const next = templates.filter((t) => t.id !== id);
    setTemplates(next);
    localStorage.setItem("crt_templates_v1", JSON.stringify(next));
  }

  function handleImportJSON(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const obj = JSON.parse(text);

        const tpl = {
          ...obj,
          id: obj.id || uid(),
        };

        const next = [tpl, ...templates];
        setTemplates(next);
        localStorage.setItem(
          "crt_templates_v1",
          JSON.stringify(next)
        );

        loadTemplate(tpl);
        alert("Template imported successfully.");
      } catch (err) {
        console.error(err);
        alert("Invalid JSON file.");
      } finally {
        event.target.value = "";
      }
    };

    reader.readAsText(file);
  }

  function handleImportClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const filteredTemplates = templates.filter((t) => {
    const q = templateSearch.trim().toLowerCase();
    if (!q) return true;
    return (t.name || "").toLowerCase().includes(q);
  });

  /* --------------------------------------------------------------------------
     8) RENDER JSX (layout responsive + animations)
     -------------------------------------------------------------------------- */

  return (
    <div className="p-3 md:p-4 bg-gray-50 h-auto md:h-[calc(100vh-64px)]">
      <div className="max-w-screen-2xl mx-auto h-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full min-h-0">
          {/* COLONNE GAUCHE : contrôles */}
          <div className="md:col-span-4 bg-white rounded-2xl p-4 shadow-sm flex flex-col min-h-0">
            {/* Onglets */}
            <div className="flex gap-2 mb-4">
              {["shape", "colors", "save"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 text-xs md:text-sm font-medium px-3 md:px-4 py-2 rounded-md transition-colors duration-150 ${
                    activeTab === tab
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Zone scrollable des contrôles */}
            <div
              className="overflow-auto min-h-0 px-1 md:px-2 pr-3 md:pr-4 pb-6"
              style={{ maxHeight: "calc(100vh - 64px - 56px)" }}
            >
              {/* TAB SHAPE */}
              {activeTab === "shape" && (
                <div className="space-y-6">
                  {/* Choix du type de forme */}
                  <div className="grid grid-cols-5 gap-2 md:gap-3">
                    {["flakes", "circles", "squares", "stars", "tile"].map(
                      (t) => (
                        <button
                          key={t}
                          onClick={() => setShapeType(t)}
                          className={`col-span-1 p-2 md:p-3 rounded-md border flex flex-col items-center justify-center gap-2 text-[10px] md:text-xs 
                            transition-all duration-150
                            ${
                              shapeType === t
                                ? "bg-gray-800 text-white border-gray-800 shadow-md scale-[1.03]"
                                : "bg-white text-gray-700 border-gray-200 hover:shadow-sm hover:-translate-y-0.5"
                            }`}
                        >
                          <ShapeIcon
                            type={t}
                            className={
                              shapeType === t
                                ? "text-white"
                                : "text-gray-700"
                            }
                          />
                          <span className="mt-1">{t}</span>
                        </button>
                      )
                    )}
                  </div>

                  {/* Width scale */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Width (Visual)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0.2"
                        max="3"
                        step="0.01"
                        value={widthScale}
                        onChange={(e) =>
                          setWidthScale(Number(e.target.value))
                        }
                        className="flex-1"
                      />
                      <div className="w-12 text-right text-[11px] md:text-xs font-mono">
                        {widthScale.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Height scale */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Height (Visual)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0.2"
                        max="3"
                        step="0.01"
                        value={heightScale}
                        onChange={(e) =>
                          setHeightScale(Number(e.target.value))
                        }
                        className="flex-1"
                      />
                      <div className="w-12 text-right text-[11px] md:text-xs font-mono">
                        {heightScale.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Min size */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Min Size
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={MIN_MIN_SIZE}
                        max={MAX_MIN_SIZE}
                        step="1"
                        value={minSize}
                        onChange={(e) => {
                          let v = Number(e.target.value);
                          v = Math.max(
                            MIN_MIN_SIZE,
                            Math.min(v, MAX_MIN_SIZE)
                          );
                          const clamped = Math.min(v, maxSize);
                          setMinSize(clamped);
                        }}
                        className="flex-1"
                      />
                      <div className="w-12 text-right text-[11px] md:text-xs">
                        {minSize}px
                      </div>
                    </div>
                  </div>

                  {/* Max size */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Max Size
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={MIN_MAX_SIZE}
                        max={MAX_MAX_SIZE}
                        step="1"
                        value={maxSize}
                        onChange={(e) => {
                          let v = Number(e.target.value);
                          v = Math.max(
                            MIN_MAX_SIZE,
                            Math.min(v, MAX_MAX_SIZE)
                          );
                          const clamped = Math.max(v, minSize);
                          setMaxSize(clamped);
                        }}
                        className="flex-1"
                      />
                      <div className="w-12 text-right text-[11px] md:text-xs">
                        {maxSize}px
                      </div>
                    </div>
                  </div>

                  {/* Density */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Density
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={density}
                        onChange={(e) =>
                          setDensity(Number(e.target.value))
                        }
                        className="flex-1"
                      />
                      <div className="w-12 text-right text-[11px] md:text-xs font-mono">
                        {density}%
                      </div>
                    </div>
                  </div>

                  {/* Random Seed */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Random Seed
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <input
                        type="number"
                        value={seed}
                        onChange={(e) =>
                          setSeed(Number(e.target.value))
                        }
                        className="flex-1 rounded-md border px-3 py-2 bg-gray-50 text-xs font-mono"
                      />
                      <button
                        onClick={() =>
                          setSeed(
                            Math.floor(
                              Math.random() * 90000
                            ) + 10000
                          )
                        }
                        className="px-3 py-2 rounded-md border bg-white text-xs md:text-sm transition hover:bg-gray-50"
                      >
                        Randomize
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB COLORS */}
              {activeTab === "colors" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Color Settings
                  </h3>

                  {/* Background */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Background
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={background}
                        onChange={(e) =>
                          setBackground(e.target.value)
                        }
                        className="w-12 h-8 p-0 rounded-md border"
                      />
                      <input
                        value={background}
                        onChange={(e) =>
                          setBackground(e.target.value)
                        }
                        className="flex-1 rounded-md border px-3 py-2 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Palette colors */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">
                        Palette Colors
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingColorIndex(null);
                            setShowAddColor(true);
                          }}
                          className="px-3 py-2 rounded-md border bg-white text-xs md:text-sm flex items-center gap-2 hover:bg-gray-50 transition"
                        >
                          <Plus className="w-4 h-4" />
                          Add Color
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {palette.map((p, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-md bg-gray-50 border border-gray-100 transition-shadow hover:shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div
                                style={{ background: p.value }}
                                className="w-10 h-10 rounded shadow-sm border cursor-pointer hover:ring-2 hover:ring-gray-300 transition"
                                title="Click to change this color"
                                onClick={() => {
                                  setEditingColorIndex(i);
                                  setShowAddColor(true);
                                }}
                              />
                              <div className="text-sm font-medium">
                                {p.name.replaceAll("_", " ")}
                              </div>
                            </div>

                            {/* Lock / Delete */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updatePaletteItem(i, {
                                    locked: !p.locked,
                                  })
                                }
                                className="p-1 rounded hover:bg-gray-100 flex items-center justify-center transition"
                                aria-label={
                                  p.locked
                                    ? "Unlock color"
                                    : "Lock color"
                                }
                                title={
                                  p.locked ? "Unlock" : "Lock"
                                }
                              >
                                {p.locked ? (
                                  <Lock className="w-4 h-4 text-gray-700" />
                                ) : (
                                  <Unlock className="w-4 h-4 text-gray-700" />
                                )}
                              </button>

                              <button
                                onClick={() =>
                                  removePaletteIndex(i)
                                }
                                className="p-1 rounded hover:bg-gray-100 flex items-center justify-center transition"
                                aria-label="Delete color"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </div>

                          {/* pct slider + input */}
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              className={`w-20 rounded-md border px-2 py-1 text-sm ${
                                p.locked
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              value={p.pct}
                              disabled={p.locked}
                              onChange={(e) => {
                                if (p.locked) return;
                                const v = e.target.value;
                                const pct =
                                  v === "" ? 0 : Number(v);
                                if (!Number.isNaN(pct)) {
                                  updatePaletteItem(i, {
                                    pct,
                                  });
                                }
                              }}
                            />
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="0.1"
                              value={p.pct}
                              disabled={p.locked}
                              onChange={(e) => {
                                if (p.locked) return;
                                updatePaletteItem(i, {
                                  pct: Number(
                                    e.target.value
                                  ),
                                });
                              }}
                              className={`flex-1 ${
                                p.locked
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB SAVE */}
              {activeTab === "save" && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">
                    Save & Export
                  </h3>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Template Name *
                    </label>
                    <input
                      value={templateName}
                      onChange={(e) =>
                        setTemplateName(e.target.value)
                      }
                      className="w-full p-2 rounded-md border"
                      placeholder="Enter template name"
                    />
                  </div>

                  <div className="flex flex-col gap-3 mt-2">
                    {/* Save to library */}
                    <button
                      onClick={saveTemplate}
                      disabled={!templateName.trim()}
                      className={`w-full px-4 py-3 rounded-md text-sm flex items-center justify-center gap-2
                        transition-all duration-150
                        ${
                          templateName.trim()
                            ? "bg-gray-800 text-white hover:bg-gray-900 hover:-translate-y-0.5 hover:shadow-md"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      <Save className="w-4 h-4" />
                      <span>Save to Library</span>
                    </button>

                    {/* Dropdown Export (PNG / JSON) */}
                    <div
                      className="relative"
                      ref={exportMenuRef}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setShowExportMenu((v) => !v)
                        }
                        className="w-full px-4 py-3 rounded-md border bg-white text-sm flex items-center justify-between gap-2 hover:bg-gray-50 transition"
                      >
                        <span className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          <span>Export</span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            showExportMenu ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {showExportMenu && (
                        <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20 origin-top-right transform transition-all duration-150 ease-out">
                          <button
                            type="button"
                            onClick={() => {
                              exportPNG();
                              setShowExportMenu(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <ImageIcon className="w-4 h-4" />
                            <span>Export PNG</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              downloadCurrentTemplateJSON();
                              setShowExportMenu(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            <span>Export JSON</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Import JSON */}
                    <button
                      onClick={handleImportClick}
                      className="w-full px-4 py-3 rounded-md border bg-white text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Import JSON</span>
                    </button>

                    {/* Templates Library */}
                    <button
                      onClick={() => {
                        setShowTemplatesModal(true);
                        setActiveTemplateId(null);
                      }}
                      className="w-full px-4 py-3 rounded-md border bg-gray-100 text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition"
                    >
                      <FolderOpen className="w-4 h-4" />
                      <span>Templates Library</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* COLONNE CENTRALE : preview canvas */}
          <div className="md:col-span-5 bg-white rounded-2xl p-4 shadow-sm flex items-center justify-center min-h-[260px] md:min-h-0">
            <div className="border rounded-xl overflow-hidden w-full max-w-[500px] shadow-sm">
              <canvas
                ref={canvasRef}
                width={previewSize}
                height={previewSize}
                style={{
                  width: "100%",
                  maxWidth: previewSize + "px",
                  height: "auto",
                  display: "block",
                }}
              />
            </div>
          </div>

          {/* COLONNE DROITE : résumé palette */}
          <div className="md:col-span-3 bg-white rounded-2xl p-4 shadow-sm flex flex-col min-h-0">
            <div
              className="overflow-auto min-h-0"
              style={{ maxHeight: "calc(100vh - 64px - 48px)" }}
            >
              <div className="mb-4">
                <h3 className="font-semibold">
                  Palette Summary
                </h3>
                <div className="mt-2 space-y-2">
                  {palette.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border transition-shadow hover:shadow-sm"
                    >
                      <div
                        style={{ background: p.value }}
                        className="w-8 h-8 rounded"
                      />
                      <div className="flex-1">
                        <div className="text-xs md:text-sm font-medium">
                          {p.name.replaceAll("_", " ")}
                        </div>
                      </div>
                      <div className="text-xs md:text-sm text-gray-600 font-medium">
                        {p.pct}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* input caché pour Import JSON */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImportJSON}
      />

      {/* MODAL : Add Color */}
      {showAddColor && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-start md:items-center backdrop-blur-md bg-black/20"
        >
          <div className="mt-10 md:mt-0 w-full flex justify-center">
            <div
              className="bg-white rounded-2xl w-[min(560px,90vw)] max-w-[560px] shadow-2xl p-6 mx-4 flex flex-col transform transition-all duration-200 scale-100"
              style={{ maxHeight: "calc(100vh - 160px)" }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-full text-center">
                  <h2 className="text-lg md:text-xl font-semibold">
                    {editingColorIndex !== null
                      ? "Change Color"
                      : "Add Color"}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    {editingColorIndex !== null
                      ? "Choose a new color for the selected palette entry"
                      : "Choose a color to add to your design"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddColor(false);
                    setEditingColorIndex(null);
                  }}
                  className="ml-4 text-gray-400 hover:text-gray-700 p-2 rounded"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Grille de couleurs */}
              <div
                className="overflow-y-auto"
                style={{ flex: "1 1 auto", paddingRight: 6 }}
              >
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4">
                  {SOURCE_COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handlePickColor(c)}
                      className="relative flex flex-col items-center gap-2 md:gap-3 p-2 rounded-lg hover:shadow-md transition-shadow"
                      title={c.name.replaceAll("_", " ")}
                    >
                      <div
                        style={{ background: c.value }}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-lg shadow-sm border border-gray-200"
                      />
                      <div className="text-[10px] md:text-xs text-gray-700 lowercase tracking-wide text-center">
                        {c.name.replaceAll("_", " ")}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-4 mb-3 border-t border-gray-100" />

                {/* Custom Colors */}
                <div className="mb-2">
                  <div className="text-sm font-semibold text-gray-700">
                    Custom Colors
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4 mb-2">
                  {CUSTOM_COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handlePickColor(c)}
                      className="relative flex flex-col items-center gap-2 md:gap-3 p-2 rounded-lg hover:shadow-md transition-shadow"
                      title={c.name}
                    >
                      <div
                        style={{ background: c.value }}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-lg shadow-sm border border-gray-200"
                      />
                      <div className="text-[10px] md:text-xs text-gray-700 lowercase tracking-wide text-center">
                        {c.name}
                      </div>
                    </button>
                  ))}
                  <div className="hidden md:block" />
                  <div className="hidden md:block" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL : Templates Library */}
      {showTemplatesModal && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-start md:items-center backdrop-blur-md bg-black/20"
        >
          <div className="mt-10 md:mt-0 w-full flex justify-center">
            <div
              className="bg-white rounded-2xl w-[min(720px,94vw)] max-w-[720px] shadow-2xl p-5 md:p-6 mx-4 flex flex-col transform transition-all duration-200 scale-100"
              style={{ maxHeight: "calc(100vh - 80px)" }}
            >
              {/* Header + search */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 flex flex-col items-center gap-2">
                  <h2 className="text-lg md:text-xl font-semibold">
                    Templates Library
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500">
                    Tap or click a template to load it
                  </p>

                  <div className="w-full max-w-md mt-2">
                    <div className="relative group transition-all">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-700 transition-colors">
                        <Search className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={templateSearch}
                        onChange={(e) =>
                          setTemplateSearch(e.target.value)
                        }
                        placeholder="Search templates..."
                        className="w-full pl-9 pr-3 py-2 rounded-full border border-gray-200 text-xs md:text-sm outline-none
                                   focus:ring-2 focus:ring-gray-300 focus:border-gray-400
                                   transition-all shadow-sm focus:shadow-md"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowTemplatesModal(false);
                    setActiveTemplateId(null);
                  }}
                  className="ml-2 md:ml-4 text-gray-400 hover:text-gray-700 p-2 rounded"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Liste des templates */}
              <div
                className="overflow-y-auto"
                style={{ flex: "1 1 auto", paddingRight: 6 }}
              >
                {filteredTemplates.length === 0 && (
                  <div className="text-gray-500 text-sm text-center py-8">
                    No templates found.
                  </div>
                )}

                {filteredTemplates.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                    {filteredTemplates.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          if (activeTemplateId !== t.id) {
                            setActiveTemplateId(t.id);
                            return;
                          }
                          loadTemplate(t);
                          setShowTemplatesModal(false);
                          setActiveTemplateId(null);
                          setActiveTab("shape");
                        }}
                        className="group relative flex flex-col items-center gap-2 p-2 rounded-lg hover:shadow-md transition-all bg-white"
                      >
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl shadow-sm border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center transition-transform group-hover:-translate-y-0.5">
                          {t.thumbnail ? (
                            <img
                              src={t.thumbnail}
                              alt={t.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[11px] text-gray-400 text-center px-1">
                              No preview
                            </span>
                          )}

                          <div
                            className={`absolute top-1 right-1 flex gap-1 transition-opacity
                              ${
                                activeTemplateId === t.id
                                  ? "opacity-100"
                                  : "opacity-0 group-hover:opacity-100"
                              }`}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                loadTemplate(t);
                                setShowTemplatesModal(false);
                                setActiveTemplateId(null);
                                setActiveTab("shape");
                              }}
                              className="p-1 rounded-full bg-white/90 hover:bg-white shadow transition-transform hover:scale-105"
                              title="Edit template"
                            >
                              <Pencil className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTemplate(t.id);
                                if (activeTemplateId === t.id) {
                                  setActiveTemplateId(null);
                                }
                              }}
                              className="p-1 rounded-full bg-white/90 hover:bg-red-50 shadow transition-transform hover:scale-105"
                              title="Delete template"
                            >
                              <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                            </button>
                          </div>
                        </div>

                        <span className="text-[11px] md:text-sm text-gray-9
00 font-medium truncate max-w-[90px] md:max-w-[120px] text-center">
                          {t.name || "Untitled"}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
