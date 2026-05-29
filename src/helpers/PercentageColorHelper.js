// Place this in a helpers file or at the top of your component

/**
 * Returns a color code based on the percent value.
 * @param {number} percent - The percentage value (0-100)
 * @returns {string} - Hex color code
 */
export function getPercentageColor(percent) {
    if (percent < 0 || percent > 100) return "#000000"; // Default to black for invalid input
    if (percent < 10) return "#B71C1C";      // Dark Red for very low
    if (percent < 20) return "#F44336";      // Red for low
    if (percent < 30) return "#D32F2F";      // Red for low
    if (percent < 70) return "#FFA000";      // Orange for medium
    return "#388E3C";                        // Green for high
}