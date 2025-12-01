export const GOLDEN_ANGLE = 137.508;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const colorFromIndex = (
  index: number,
  saturation: number = 85,
  lightness: number = 55,
  hueOffset: number = 0
): string => {
  const hue = (index * GOLDEN_ANGLE + hueOffset) % 360;
  const sat = clamp(saturation, 0, 100);
  const light = clamp(lightness, 0, 100);
  return `hsl(${hue}, ${sat}%, ${light}%)`;
};

export const generateContrastingColors = (
  count: number,
  saturation: number = 85,
  baseLightness: number = 55
): string[] => {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const lightness = i % 2 === 0 ? baseLightness : baseLightness + 10; // alternate light/dark for contrast
    colors.push(colorFromIndex(i, saturation, lightness));
  }
  return colors;
};