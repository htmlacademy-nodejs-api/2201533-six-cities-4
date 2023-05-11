const GROUP_LENGTH = 3;
const THOUSAND_SEPARATOR = ' ';
export function formatInt(val: number) {
  const s = val.toString().trim();
  const groupsCount = Math.ceil(s.length / GROUP_LENGTH);
  let firstCount = s.length % GROUP_LENGTH;
  firstCount = firstCount === 0 ? 3 : firstCount;
  return Array.from(Array(groupsCount),(_, i) =>
    i === 0 ? s.substring(0, i * GROUP_LENGTH + firstCount) :
      s.substring((i - 1) * GROUP_LENGTH + firstCount, i * GROUP_LENGTH + firstCount)).join(THOUSAND_SEPARATOR);
}
