// Seeded random number generator
class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }

  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

export const renderPattern = (canvas, config) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const size = 600;

  // Set actual canvas size for high DPI
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;

  ctx.scale(dpr, dpr);

  // Clear and fill background
  ctx.fillStyle = config.backgroundColor;
  ctx.fillRect(0, 0, size, size);

  // Create seeded random
  const random = new SeededRandom(config.seed);

  // Calculate number of shapes based on density
  const area = size * size;
  const avgSize = (config.minSize + config.maxSize) / 2;
  const avgShapeArea = avgSize * avgSize;
  const numShapes = Math.floor((area * config.density) / avgShapeArea);

  // Generate shapes
  for (let i = 0; i < numShapes; i++) {
    const x = random.next() * size;
    const y = random.next() * size;
    const baseSize = config.minSize + random.next() * (config.maxSize - config.minSize);
    const width = baseSize * config.widthScale;
    const height = baseSize * config.heightScale;
    const rotation = random.next() * Math.PI * 2;

    // Select color based on percentages
    const colorRoll = random.next() * 100;
    let accum = 0;
    let selectedColor = config.palette[0]?.value || "#000000";

    for (const color of config.palette) {
      accum += color.percentage;
      if (colorRoll <= accum) {
        selectedColor = color.value;
        break;
      }
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = selectedColor;

    switch (config.shapeType) {
      case "flakes":
        drawFlake(ctx, width, height, random);
        break;
      case "circles":
        drawCircle(ctx, width, height);
        break;
      case "squares":
        drawSquare(ctx, width, height);
        break;
      case "stars":
        drawStar(ctx, width, height);
        break;
      case "tile":
        drawTile(ctx, width, height, random);
        break;
    }

    ctx.restore();
  }
};

const drawFlake = (ctx, width, height, random) => {
  // Irregular polygon (flake shape)
  const numPoints = 5 + Math.floor(random.next() * 4); // 5-8 points
  ctx.beginPath();

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const radiusVariation = 0.6 + random.next() * 0.4; // 60-100% of size
    const px = Math.cos(angle) * width * 0.5 * radiusVariation;
    const py = Math.sin(angle) * height * 0.5 * radiusVariation;

    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }

  ctx.closePath();
  ctx.fill();
};

const drawCircle = (ctx, width, height) => {
  ctx.beginPath();
  ctx.ellipse(0, 0, width / 2, height / 2, 0, 0, Math.PI * 2);
  ctx.fill();
};

const drawSquare = (ctx, width, height) => {
  ctx.fillRect(-width / 2, -height / 2, width, height);
};

const drawStar = (ctx, width, height) => {
  const spikes = 5;
  const outerRadius = width / 2;
  const innerRadius = height / 4;

  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / spikes;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fill();
};

const drawTile = (ctx, width, height, random) => {
  // Rectangular tile with slight variation
  const w = width * (0.9 + random.next() * 0.2);
  const h = height * (0.9 + random.next() * 0.2);
  ctx.fillRect(-w / 2, -h / 2, w, h);
};