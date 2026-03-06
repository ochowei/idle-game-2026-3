/**
 * 將數字轉換為可讀的簡寫字串。
 * 規則：
 *  < 1,000       → 原始整數，如 "999"
 *  < 1,000,000   → 兩位小數 + k，如 "1.50k"
 *  < 1,000,000,000  → 兩位小數 + M，如 "2.50M"
 *  < 1e12        → 兩位小數 + B，如 "1.00B"
 *  < 1e15        → 兩位小數 + T，如 "1.00T"
 *  >= 1e15       → 科學記數法（toExponential(2)），如 "1.50e+15"
 */
export function formatNumber(value: number): string {
  if (!isFinite(value) || isNaN(value)) return '0';
  if (value < 0) return '-' + formatNumber(-value);

  if (value < 1_000) return String(Math.floor(value));
  if (value < 1_000_000) return (value / 1_000).toFixed(2) + 'k';
  if (value < 1_000_000_000) return (value / 1_000_000).toFixed(2) + 'M';
  if (value < 1e12) return (value / 1e9).toFixed(2) + 'B';
  if (value < 1e15) return (value / 1e12).toFixed(2) + 'T';
  return value.toExponential(2);
}

/**
 * 格式化每秒產量顯示，附加 "/s" 後綴。
 * 例如：formatRate(1.5) → "1.50/s"
 */
export function formatRate(value: number): string {
  if (!isFinite(value) || isNaN(value)) return '0/s';
  if (value < 0) return '-' + formatRate(-value);

  if (value < 1_000) return value.toFixed(2) + '/s';
  return formatNumber(value) + '/s';
}
