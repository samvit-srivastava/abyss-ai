export type OceanZoneName =
  | 'Surface'
  | 'Sunlight Zone'
  | 'Twilight Zone'
  | 'Midnight Zone'
  | 'Abyssal Zone'
  | 'Hadal Zone';

export interface ZoneInfo {
  name: OceanZoneName;
  depthRange: string;
  minDepth: number;
  maxDepth: number;
  description: string;
}

export const OCEAN_ZONES: ZoneInfo[] = [
  {
    name: 'Surface',
    depthRange: '0m',
    minDepth: 0,
    maxDepth: 10,
    description: 'The ocean surface bathed in direct sunlight and open air.',
  },
  {
    name: 'Sunlight Zone',
    depthRange: '0m - 200m',
    minDepth: 0,
    maxDepth: 200,
    description: 'The euphotic zone where sunlight fuels 90% of all marine life.',
  },
  {
    name: 'Twilight Zone',
    depthRange: '200m - 1,000m',
    minDepth: 200,
    maxDepth: 1000,
    description: 'Faint sunlight dims into shadow. Creatures rely on bioluminescence.',
  },
  {
    name: 'Midnight Zone',
    depthRange: '1,000m - 4,000m',
    minDepth: 1000,
    maxDepth: 4000,
    description: 'Complete, crushing dark. Water pressure exceeds 400 atmospheres.',
  },
  {
    name: 'Abyssal Zone',
    depthRange: '4,000m - 6,000m',
    minDepth: 4000,
    maxDepth: 6000,
    description: 'Near-freezing abyssal plains and geothermal volcanic vents.',
  },
  {
    name: 'Hadal Zone',
    depthRange: '6,000m - 11,000m',
    minDepth: 6000,
    maxDepth: 11000,
    description: 'The deepest oceanic trenches on Earth. Extreme hydrostatic pressure.',
  },
];

/**
 * Computes depth in meters given a 0..1 scroll progress value.
 */
export function calculateDepthFromProgress(progress: number): number {
  const clamped = Math.max(0, Math.min(1, progress));
  return Math.round(clamped * 11000);
}

/**
 * Computes hydrostatic pressure in atmospheres (ATM) for a given depth.
 */
export function calculatePressureFromDepth(depthMeters: number): number {
  return Math.round(1 + depthMeters / 10);
}

/**
 * Computes water temperature in Celsius using piecewise interpolation across ocean layers.
 */
export function calculateTemperatureFromDepth(depthMeters: number): number {
  if (depthMeters <= 0) return 20.0;
  if (depthMeters < 200) {
    return 20.0 - (depthMeters / 200) * 4.0;
  } else if (depthMeters < 1000) {
    return 16.0 - ((depthMeters - 200) / 800) * 11.0;
  } else if (depthMeters < 4000) {
    return 5.0 - ((depthMeters - 1000) / 3000) * 2.5;
  } else if (depthMeters < 6000) {
    return 2.5 - ((depthMeters - 4000) / 2000) * 1.1;
  } else {
    return Math.max(1.0, 1.4 - ((depthMeters - 6000) / 5000) * 0.3);
  }
}

/**
 * Resolves the active OceanZoneName for a given depth.
 */
export function getZoneFromDepth(depthMeters: number): OceanZoneName {
  if (depthMeters === 0) return 'Surface';
  if (depthMeters <= 200) return 'Sunlight Zone';
  if (depthMeters <= 1000) return 'Twilight Zone';
  if (depthMeters <= 4000) return 'Midnight Zone';
  if (depthMeters <= 6000) return 'Abyssal Zone';
  return 'Hadal Zone';
}
