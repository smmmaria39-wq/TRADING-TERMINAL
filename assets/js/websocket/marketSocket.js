import websocketClient from './websocketClient.js';

/**
 * Market Data Socket Handler
 */
class MarketSocket {
 constructor() {
  this.tickCallbacks = new Set();
 }
 
 init() {
  websocketClient.subscribe('MARKET_TICK', this.handleTick.bind(this));
 }
 
 handleTick(tickData) {
  // Dispatch tick data to all registered callbacks
  this.tickCallbacks.forEach(cb => cb(tickData));
 }
 
 onTick(callback) {
  this.tickCallbacks.add(callback);
  return () => this.tickCallbacks.delete(callback); // Return unsubscribe function
 }
 
 subscribeToSymbol(symbol) {
  websocketClient.send({ action: 'SUBSCRIBE', channel: 'MARKET_TICK', symbol });
 }
 
 unsubscribeFromSymbol(symbol) {
  websocketClient.send({ action: 'UNSUBSCRIBE', channel: 'MARKET_TICK', symbol });
 }
}

export const marketSocket = new MarketSocket();
export default marketSocket;