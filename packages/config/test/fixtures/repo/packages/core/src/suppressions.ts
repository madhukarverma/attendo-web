export function loose(value: any): number {
  return Number(value);
}

// @ts-ignore no reason given
export const a: number = 'x';

// @ts-expect-error: string is not a number https://github.com/example/repo/issues/1
export const b: number = 'y';
