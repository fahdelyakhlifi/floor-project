export const normalizePalette = (palette) => {
  if (palette.length === 0) return palette;

  const lockedColors = palette.filter((c) => c.locked);
  const unlockedColors = palette.filter((c) => !c.locked);

  if (unlockedColors.length === 0) {
    // All colors are locked, return as is
    return palette;
  }

  const lockedTotal = lockedColors.reduce((sum, c) => sum + c.percentage, 0);
  const remainingPercentage = Math.max(0, 100 - lockedTotal);

  // Calculate current unlocked total
  const currentUnlockedTotal = unlockedColors.reduce((sum, c) => sum + c.percentage, 0);

  // Distribute remaining percentage proportionally
  const normalizedUnlocked = unlockedColors.map((color) => {
    if (currentUnlockedTotal === 0) {
      // Equal distribution if all unlocked are 0
      return {
        ...color,
        percentage: Number((remainingPercentage / unlockedColors.length).toFixed(2)),
      };
    }

    const proportion = color.percentage / currentUnlockedTotal;
    return {
      ...color,
      percentage: Number((remainingPercentage * proportion).toFixed(2)),
    };
  });

  // Combine locked and normalized unlocked
  const result = [...lockedColors, ...normalizedUnlocked];

  // Adjust for rounding errors - add difference to first unlocked color
  const total = result.reduce((sum, c) => sum + c.percentage, 0);
  const diff = 100 - total;
  
  if (Math.abs(diff) > 0.01 && normalizedUnlocked.length > 0) {
    const firstUnlockedIndex = result.findIndex((c) => !c.locked);
    if (firstUnlockedIndex !== -1) {
      result[firstUnlockedIndex].percentage = Number(
        (result[firstUnlockedIndex].percentage + diff).toFixed(2)
      );
    }
  }

  return result;
};