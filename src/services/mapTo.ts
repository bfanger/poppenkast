export default function mapTo(
  current: number,
  fromMin: number,
  fromMax: number,
  targetMin: number,
  targetMax: number,
) {
  const clamped = Math.min(fromMax, Math.max(current, fromMin));
  const ratio = (clamped - fromMin) / (fromMax - fromMin);
  return targetMin + ratio * (targetMax - targetMin);
}
