import { isPositiveNumber } from '../utils/validators.js';

/**
 * Risk Calculator (Frontend UX Helper)
 * Note: The backend has the authoritative risk engine. This is strictly 
 * to provide immediate user feedback in the trading UI.
 */
export function calculateRisk(entry, stopLoss, balance, riskPercent = 1) {
 // Strict validation: ensure all inputs are valid positive numbers
 if (!isPositiveNumber(entry) || !isPositiveNumber(stopLoss) || !isPositiveNumber(balance)) {
  return null;
 }
 
 const riskAmount = balance * (riskPercent / 100);
 const stopDistance = Math.abs(parseFloat(entry) - parseFloat(stopLoss));
 
 // Prevent division by zero if entry and stop loss are identical
 if (stopDistance === 0) return null;
 
 // Assuming standard pip value ($10 per pip per standard lot) and 0.0001 pip size
 // Note: JPY pairs have different pip sizes, but the backend handles the final calculation.
 const lotSize = riskAmount / (stopDistance * 10000 * 10);
 
 return {
  riskAmount: parseFloat(riskAmount.toFixed(2)),
  lotSize: Math.max(0.01, parseFloat(lotSize.toFixed(2)))
 };
}