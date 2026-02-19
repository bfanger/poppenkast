/**
 * Linearly interpolate between two numbers.
 */
export default function lerp(from: number, to: number, factor: number): number {
  return from + (to - from) * factor;
}
