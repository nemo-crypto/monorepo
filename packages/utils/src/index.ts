/** 稳定分组，不改变输入数组；元素不做深拷贝。 */
export function chunk<T>(items: readonly T[], size: number): T[][] {
  if (!Number.isSafeInteger(size) || size < 1) {
    throw new RangeError('size 必须为正安全整数');
  }
  const groups: T[][] = [];
  for (let offset = 0; offset < items.length; offset += size) {
    groups.push(items.slice(offset, offset + size));
  }
  return groups;
}

/** 限制输入范围，防止报告悄悄展示无效百分比。 */
export function formatPercent(ratio: number): string {
  if (!Number.isFinite(ratio) || ratio < 0 || ratio > 1) {
    throw new RangeError('ratio 必须是 0..1 之间的有限数字');
  }
  return `${(ratio * 100).toFixed(1)}%`;
}
