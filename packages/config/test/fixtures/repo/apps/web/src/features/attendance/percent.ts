export function percent(attended: number, held: number): number {
  return held === 0 ? 0 : (attended / held) * 100;
}
