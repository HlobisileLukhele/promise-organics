export const FREE_SHIPPING_THRESHOLD = 580
export const STANDARD_SHIPPING_COST = 99

/**
 * Calculate shipping cost based on the order subtotal.
 * Returns 0 if the cart is empty, 0 if the free shipping threshold is met,
 * otherwise returns the standard shipping cost.
 */
export function calculateShipping(subtotal) {
  if (subtotal === 0) return 0
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST
}
