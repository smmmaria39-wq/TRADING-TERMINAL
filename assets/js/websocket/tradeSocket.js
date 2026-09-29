import websocketClient from './websocketClient.js';

/**
 * Trade & Position Socket Handler
 */
class TradeSocket {
 constructor() {
  this.positionCallbacks = new Set();
  this.executionCallbacks = new Set();
 }
 
 init() {
  websocketClient.subscribe('POSITION_UPDATE', this.handlePosition.bind(this));
  websocketClient.subscribe('ORDER_EXECUTION', this.handleExecution.bind(this));
 }
 
 handlePosition(positionData) {
  this.positionCallbacks.forEach(cb => cb(positionData));
 }
 
 handleExecution(executionData) {
  this.executionCallbacks.forEach(cb => cb(executionData));
 }
 
 onPositionUpdate(callback) {
  this.positionCallbacks.add(callback);
  return () => this.positionCallbacks.delete(callback);
 }
 
 onOrderExecution(callback) {
  this.executionCallbacks.add(callback);
  return () => this.executionCallbacks.delete(callback);
 }
}

export const tradeSocket = new TradeSocket();
export default tradeSocket;