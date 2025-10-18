export class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }

  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  range(min, max) {
    return min + this.next() * (max - min);
  }
}

export const generateShapePositions = (
  count,
  seed,
  minSize,
  maxSize,
  width,
  height,
  designType,
  colorCount,
  shapeWidth,
  shapeHeight
) => {
  const rng = new SeededRandom(seed);
  const positions = [];

  // Calculer la taille basée sur les dimensions de la forme
  const getAdjustedSize = () => {
    const baseSize = rng.range(minSize, maxSize);
    // Adapter la taille selon les proportions de la forme
    const aspectRatio = shapeWidth / shapeHeight;
    const adjustedSize = baseSize * Math.sqrt(Math.abs(aspectRatio));
    return Math.max(minSize, Math.min(maxSize, adjustedSize));
  };

  if (designType === 'grid') {
    const cols = Math.ceil(Math.sqrt(count * (width / height)));
    const rows = Math.ceil(count / cols);
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * cellWidth + cellWidth / 2 + rng.range(-cellWidth * 0.2, cellWidth * 0.2);
      const y = row * cellHeight + cellHeight / 2 + rng.range(-cellHeight * 0.2, cellHeight * 0.2);

      positions.push({
        x: Math.max(0, Math.min(width, x)),
        y: Math.max(0, Math.min(height, y)),
        size: getAdjustedSize(),
        rotation: rng.range(0, 360),
        colorIndex: Math.floor(rng.next() * colorCount),
        id: `shape-${i}`
      });
    }
  } else if (designType === 'wavy') {
    const rows = Math.ceil(Math.sqrt(count));
    const cols = Math.ceil(count / rows);
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const baseX = col * cellWidth + cellWidth / 2;
      const baseY = row * cellHeight + cellHeight / 2;

      const waveOffset = Math.sin(row * 0.5) * cellWidth * 0.3;
      const x = baseX + waveOffset + rng.range(-cellWidth * 0.15, cellWidth * 0.15);
      const y = baseY + rng.range(-cellHeight * 0.15, cellHeight * 0.15);

      positions.push({
        x: Math.max(0, Math.min(width, x)),
        y: Math.max(0, Math.min(height, y)),
        size: getAdjustedSize(),
        rotation: rng.range(0, 360),
        colorIndex: Math.floor(rng.next() * colorCount),
        id: `shape-${i}`
      });
    }
  } else {
    for (let i = 0; i < count; i++) {
      positions.push({
        x: rng.range(0, width),
        y: rng.range(0, height),
        size: getAdjustedSize(),
        rotation: rng.range(0, 360),
        colorIndex: Math.floor(rng.next() * colorCount),
        id: `shape-${i}`
      });
    }
  }

  return positions;
};