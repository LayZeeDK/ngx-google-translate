/**
 * Insert the part into the target string at the specified character index.
 */
export function insertAt(index: number, target: string, part: string): string {
  return target.substr(0, index) + part + target.substr(index);
}
