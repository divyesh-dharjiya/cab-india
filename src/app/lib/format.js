const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatPrice = (amount) => rupees.format(Math.round(amount));

export function formatDistance(metres) {
  if (metres < 1000) {
    return `${Math.round(metres)} m`;
  }
  const km = metres / 1000;
  return `${km.toLocaleString("en-IN", { maximumFractionDigits: km < 100 ? 1 : 0 })} km`;
}

export function formatDuration(seconds) {
  const totalMinutes = Math.max(1, Math.round(seconds / 60));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  return [
    days && `${days} d`,
    hours && `${hours} h`,
    minutes && `${minutes} min`,
  ]
    .filter(Boolean)
    .join(" ");
}
