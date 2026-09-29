import websocketClient from './websocketClient.js';

/**
 * Signal Data Socket Handler
 */
class SignalSocket {
 constructor() {
  this.signalCallbacks = new Set();
 }
 
 init() {
  websocketClient.subscribe('SIGNAL_UPDATE', this.handleSignal.bind(this));
 }
 
 handleSignal(signalData) {
  this.signalCallbacks.forEach(cb => cb(signalData));
 }
 
 onNewSignal(callback) {
  this.signalCallbacks.add(callback);
  return () => this.signalCallbacks.delete(callback);
 }
}

export const signalSocket = new SignalSocket();
export default signalSocket;