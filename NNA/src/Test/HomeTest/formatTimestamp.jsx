export function formatTimestamp(timestamp) {
  if (!timestamp) return "-";
  const dateObj = new Date(timestamp);
  return dateObj.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}
