const HabitColor = {
  RED: '#e57373',
  BLUE: '#64b5f6',
  GREEN: '#81c784',
  YELLOW: '#ffd54f',
  PURPLE: '#ba68c8',
  ORANGE: '#ffb74d',
  PINK: '#f06292',
  TEAL: '#4db6ac',
};  

const getColorRange = (baseColor) => {
  // Convert hex to HSL for better control over lightness
  const getRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgb = getRgb(baseColor);
  if (!rgb) return ['#14432a', '#166b34', '#37a446', '#4dd05a']; // fallback

  // Create 4 variations of the color with different opacities
  return [
    `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`,
    `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`,
    `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.75)`,
    `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
  ];
};
