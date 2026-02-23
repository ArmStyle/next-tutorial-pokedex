/**
 * Convert a number (1-9) to Roman numerals
 */
export function toRomanNumeral(num: number): string {
  const romanMap: Record<number, string> = {
    1: 'I',
    2: 'II',
    3: 'III',
    4: 'IV',
    5: 'V',
    6: 'VI',
    7: 'VII',
    8: 'VIII',
    9: 'IX',
  };

  return romanMap[num] || String(num);
}
