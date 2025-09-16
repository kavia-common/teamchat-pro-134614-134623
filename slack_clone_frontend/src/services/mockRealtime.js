export class MockRealtime {
  constructor() {
    this.listeners = new Set();
  }

  subscribe(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  emit(evt) {
    // In a real backend, this would be a websocket broadcast
    for (const cb of this.listeners) {
      try {
        cb(evt);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('MockRealtime listener error', e);
      }
    }
  }
}
