/**
 * Calculates the total price including tax
 * @param basePrice - The base price before tax
 * @param taxRate - Tax rate as a decimal (e.g., 0.08 for 8%)
 * @returns The total price including tax
 * @example
 * ```typescript
 * const total = calculateTotal(100, 0.08); // Returns 108
 * ```
 */
export function calculateTotal(basePrice: number, taxRate: number): number {
	return basePrice * (1 + taxRate);
}

