/**
 * Custom JavaScript utility function to format calculated duration metrics
 * (like Short Time, Surplus/Overtime, or Worked Hours) into clean, human-readable strings.
 *
 * Rules:
 * - 0 / negative: "0 min"
 * - Less than 60 minutes: strictly in minutes (e.g., "40 min"). No hours shown.
 * - Exactly 60 minutes: "1 hr"
 * - More than 60 minutes (Whole Hours): hours only (e.g., "2 hr", "3 hr")
 * - More than 60 minutes (With Remaining Minutes): combined (e.g. 1.67 -> "1 hr 40 min", 2.25 -> "2 hr 15 min")
 *
 * @param {number|string} decimalHours - Decimal hours (e.g., 0.67, 1.0, 1.67, 2.25)
 * @returns {string} Human-readable duration string
 */
export function formatTimeDuration(decimalHours) {
  const num = parseFloat(decimalHours);
  if (isNaN(num) || num <= 0) return "0 min";

  // Convert total decimal hours to total rounded minutes
  const totalMinutes = Math.round(num * 60);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  } else if (minutes === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${minutes} min`;
  }
}

/**
 * Format minutes directly into human-readable duration
 * @param {number} totalMinutes
 * @returns {string}
 */
export function formatMinutes(totalMinutes) {
  const mins = Math.round(Number(totalMinutes) || 0);
  if (mins <= 0) return "0 min";

  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;

  if (hours === 0) {
    return `${remainingMins} min`;
  } else if (remainingMins === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${remainingMins} min`;
  }
}
