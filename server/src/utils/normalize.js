export function normalizeKeyword(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

export function extractSchoolDomain(email = "") {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  return domain.endsWith(".edu") ? domain : "";
}
