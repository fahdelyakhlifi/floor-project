import { useEffect, useRef } from 'react';

export const DesignCanvas = ({ config, positions, onCanvasReady }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    ctx.fillStyle = config.colors.background;
    ctx.fillRect(0, 0, rect.width, rect.height);

    const getColorForIndex = (index) => {
      if (config.colors.stops.length === 0) return '#000000';

      if (config.colors.useGradient) {
        const totalPercentage = config.colors.stops.reduce((sum, stop) => sum + stop.percentage, 0);
        let cumulative = 0;
        const normalizedIndex = (index / positions.length) * 100;

        for (let i = 0; i < config.colors.stops.length; i++) {
          const stop = config.colors.stops[i];
          const normalizedPercentage = (stop.percentage / totalPercentage) * 100;
          cumulative += normalizedPercentage;

          if (normalizedIndex <= cumulative || i === config.colors.stops.length - 1) {
            if (i === 0) return stop.color;

            const prevStop = config.colors.stops[i - 1];
            const prevCumulative = cumulative - normalizedPercentage;
            const t = (normalizedIndex - prevCumulative) / normalizedPercentage;

            const prevColor = hexToRgb(prevStop.color);
            const currColor = hexToRgb(stop.color);

            const r = Math.round(prevColor.r + (currColor.r - prevColor.r) * t);
            const g = Math.round(prevColor.g + (currColor.g - prevColor.g) * t);
            const b = Math.round(prevColor.b + (currColor.b - prevColor.b) * t);

            return `rgb(${r}, ${g}, ${b})`;
          }
        }
      }

      return config.colors.stops[index % config.colors.stops.length].color;
    };

    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 };
    };

    const drawShape = (x, y, size, rotation, color) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);

      ctx.globalAlpha = config.pattern.opacity / 100;

      // Utiliser les dimensions de la forme avec ajustement de taille
      const shapeWidth = config.shape.width;
      const shapeHeight = config.shape.height;
      
      // Calculer l'échelle basée sur la taille de la position
      const scale = size / Math.max(shapeWidth, shapeHeight);
      const scaledWidth = shapeWidth * scale;
      const scaledHeight = shapeHeight * scale;

      if (config.pattern.finish === 'glossy') {
        const maxSize = Math.max(scaledWidth, scaledHeight);
        const gradient = ctx.createRadialGradient(0, -maxSize / 4, 0, 0, 0, maxSize);
        const rgb = hexToRgb(color);
        gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, `rgba(${Math.max(0, rgb.r - 40)}, ${Math.max(0, rgb.g - 40)}, ${Math.max(0, rgb.b - 40)}, 1)`);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = color;
      }

      if (config.pattern.edgeSoftness > 0) {
        const maxSize = Math.max(scaledWidth, scaledHeight);
        ctx.shadowBlur = (config.pattern.edgeSoftness / 100) * maxSize * 0.5;
        ctx.shadowColor = color;
      }

      ctx.beginPath();

      switch (config.shape.type) {
        case 'circle':
          const circleRadius = Math.min(scaledWidth, scaledHeight) / 2;
          ctx.arc(0, 0, circleRadius, 0, Math.PI * 2);
          break;

        case 'rectangle':
          ctx.rect(-scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);
          break;

        case 'triangle':
          ctx.moveTo(0, -scaledHeight / 2);
          ctx.lineTo(-scaledWidth / 2, scaledHeight / 2);
          ctx.lineTo(scaledWidth / 2, scaledHeight / 2);
          ctx.closePath();
          break;

        case 'star':
          const spikes = 5;
          const outerRadius = Math.min(scaledWidth, scaledHeight) / 2;
          const innerRadius = outerRadius / 2;
          let rot = (Math.PI / 2) * 3;
          const step = Math.PI / spikes;

          ctx.moveTo(0, -outerRadius);
          for (let i = 0; i < spikes; i++) {
            ctx.lineTo(
              Math.cos(rot) * outerRadius,
              Math.sin(rot) * outerRadius
            );
            rot += step;

            ctx.lineTo(
              Math.cos(rot) * innerRadius,
              Math.sin(rot) * innerRadius
            );
            rot += step;
          }
          ctx.closePath();
          break;
      }

      ctx.fill();
      ctx.restore();
    };

    positions.forEach((pos) => {
      const color = getColorForIndex(pos.colorIndex);
      drawShape(pos.x, pos.y, pos.size, pos.rotation, color);
    });

    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
  }, [config, positions, onCanvasReady]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-2xl shadow-lg"
      style={{ width: '100%', height: '100%' }}
    />
  );
};