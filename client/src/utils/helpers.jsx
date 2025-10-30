export function formatJson(input) {
  try {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return "Invalid JSON";
  }
}
