import { TURKEY_OUTLINE_LATLNG } from '@/components/3d/turkeyOutlineRing';

const LAT_MIN = 35.5;
const LAT_MAX = 42.5;
const LNG_MIN = 25.5;
const LNG_MAX = 45.5;
const SVG_W = 800;
const SVG_H = 400;

function latlngToSVGPoint(lat: number, lng: number): [number, number] {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * SVG_W;
  // SVG y-axis is inverted: higher latitude = smaller y
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * SVG_H;
  return [x, y];
}

function buildTurkeyPath(): string {
  const pts = TURKEY_OUTLINE_LATLNG.map(([lat, lng]) => latlngToSVGPoint(lat, lng));
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ') + ' Z';
}

/** Pre-computed SVG `d` string for Turkey's mainland outline. viewBox: "0 0 800 400". */
export const TURKEY_SVG_PATH: string = buildTurkeyPath();
